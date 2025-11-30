export const RESOLVE_M2M_TARGETS_SCRIPT = `
-- KEYS[1]: iam:resource_servers_lookup
-- KEYS[2]: iam:resource_servers_application_lookup
-- KEYS[3]: iam:application

-- ARGV[1]: JSON { internals: [...], externals: { app_slug: [...] } }
-- ARGV[2]: Origin Resource Server ClientID

local data = {}
local metadata = {}

local json = cjson.decode(ARGV[1])

local function add_error(list, code, msg, errType)
  table.insert(list, { statusCode = code, message = msg, error = errType })
end

local originRsSlug = redis.call('HGET', KEYS[1], ARGV[2])
if not originRsSlug then
  add_error(metadata, 404, "Origin Resource Server does not exists", "RESOURCE_SERVER_ORIGIN_NOT_FOUND")
  return cjson.encode({ success = false, metadata = metadata })
end

local originAppSlug = redis.call('HGET', KEYS[2], ARGV[2])
if not originAppSlug then
  add_error(metadata, 404, "Application of the origin Resource Server does not exists", "RESOURCE_SERVER_APP_ORIGIN_NOT_FOUND")
  return cjson.encode({ success = false, metadata = metadata })
end

local function get_base_path(appSlug, rsSlug)
  local appInfo = redis.call('HGET', KEYS[3], appSlug)

  if not appInfo then
    return nil
  end

  local appInfoJson = cjson.decode(appInfo)
  
  local rsKey = 'iam:application:' .. appSlug .. ':resource_servers'
  local rsInfo = redis.call('HGET', rsKey, rsSlug)

  if not rsInfo then
    return appInfoJson['url']
  end

  local rsInfoJson = cjson.decode(rsInfo)

  if not rsInfoJson['basePath'] or rsInfoJson['basePath'] == cjson.null then
    return appInfoJson['url']
  end

  return appInfoJson['url'] .. rsInfoJson['basePath']
end

local function check_permissions(appSlug, rsReceptorSlug, name, isExternal, basePath)
  local consumptionKey = 'iam:application:' .. appSlug .. ':resource_servers:' .. rsReceptorSlug .. ':consumers:' .. originRsSlug
  local scopes = redis.call('HVALS', consumptionKey)

  if #scopes == 0 then
    return {
      success = false,
      error = "RESOURCE_SERVER_NOT_PERMISSIONS_GRANTED",
      message = "No permissions granted for " .. name,
      statusCode = 403
    }
  end

  return { app = appSlug, target = rsReceptorSlug, scopes = scopes, aud = basePath, isExternal = isExternal, success = true }
end

local internalsLookupKey = 'iam:application:' .. originAppSlug .. ':resource_servers_lookup'

if json['internals'] then
  for _, name in ipairs(json['internals']) do
    local shouldProcess = true
    local targetSlug = redis.call('HGET', internalsLookupKey, name)

    if targetSlug == originRsSlug then
      add_error(metadata, 400, "Internals Resource Server '" .. (targetSlug or 'nil') .. "' cannot consume itself", "RESOURCE_SERVER_INTERNAL_SELF_CONSUMPTION")
      shouldProcess = false
    end

    if shouldProcess and not targetSlug then
      add_error(metadata, 404, "Internal Service '" .. name .. "' was not found", "RESOURCE_SERVER_INTERNAL_NOT_FOUND")
      shouldProcess = false
    end

    if shouldProcess then
      local basePath = get_base_path(originAppSlug, targetSlug)
      local result = check_permissions(originAppSlug, targetSlug, name, false, basePath)
      
      if not result.success then
        add_error(metadata, result.statusCode, result.message, result.error)
      else
        table.insert(data, result)
      end
    end
  end
end

local globalAppsSlug = 'iam:application'

if json['externals'] then
  for appSlug, services in pairs(json['externals']) do
    local shouldProcess = true
    
    local appSlugInformation = redis.call('HGET', globalAppsSlug, appSlug)
    if not appSlugInformation then
      add_error(metadata, 404, "External Application '" .. appSlug .. "' was not found", "RESOURCE_SERVER_EXTERNAL_APP_NOT_FOUND")
      shouldProcess = false
    else
      local appObj = cjson.decode(appSlugInformation)

      if originAppSlug == appObj['slug'] then
        add_error(metadata, 400, "You should call this app slug with their service '" .. appSlug .. "' omitting the appSlug before the ':' and adding the service name on 'internals' array", "RESOURCE_SERVER_EXTERNAL_APP_SELF_CONSUMPTION")
        shouldProcess = false
      end
    end

    if shouldProcess then
      local extResourceServers = 'iam:application:' .. appSlug .. ':resource_servers'
      local extResourceServersLookup = 'iam:application:' .. appSlug .. ':resource_servers_lookup'

      for _, rsName in ipairs(services) do
        local shouldProcessInternal = true
        local targetSlug = redis.call('HGET', extResourceServersLookup, rsName)

        if not targetSlug then
          add_error(metadata, 404, "Service '" .. rsName .. "' was not found on Application Slug '" .. appSlug .. "'", "RESOURCE_SERVER_EXTERNAL_NOT_FOUND")

          shouldProcessInternal = false
        end

        local targetSlugInformation = nil
        if shouldProcessInternal then
            targetSlugInformation = redis.call('HGET', extResourceServers, targetSlug)
            if not targetSlugInformation then
              add_error(metadata, 404, "Resource Server '" .. rsName .. "' was not found on information", "RESOURCE_SERVER_EXTERNAL_NOT_FOUND")
              shouldProcessInternal = false
            end
        end

        if shouldProcessInternal then
          local targetSlugObj = cjson.decode(targetSlugInformation)
          if not targetSlugObj['isGateway'] then
            add_error(metadata, 404, "Resource Server '" .. rsName .. "' was not found on information", "RESOURCE_SERVER_EXTERNAL_NOT_FOUND")
            shouldProcessInternal = false
          end
        end

        if shouldProcessInternal then
          local basePath = get_base_path(appSlug, targetSlug)
          local result = check_permissions(appSlug, targetSlug, rsName, true, basePath)

          if not result.success then
            add_error(metadata, result.statusCode, result.message, result.error)
          else
            table.insert(data, result)
          end
        end
      end
    end
  end
end

return cjson.encode({ success = true, scopes = data, metadata = metadata })
`;

export const GET_IP_BRUTE_FORCE_STATUS = `
-- KEYS[1]: iam:security:rate-limit:blocked:ip
-- KEYS[2]: iam:security:rate-limit:attempts:ip
-- ARGV[1]: MAX_ATTEMPTS
-- ARGV[2]: TIME_WINDOW
-- ARGV[3]: BLOCK_TIME

local isBlocked = redis.call('GET', KEYS[1])

if isBlocked then 
  return redis.call('TTL', KEYS[1])
end

local attempts = redis.call('INCR', KEYS[2])

if attempts == 1 then
  redis.call('EXPIRE', KEYS[2], tonumber(ARGV[2]))
end

if attempts > tonumber(ARGV[1]) then
  redis.call('UNLINK', KEYS[2])

  redis.call('SET', KEYS[1], 1, 'EX', ARGV[3])

  return tonumber(ARGV[3])
end

return 0
`;

export const GET_RS_VIA_MAPPED_NAME = `
-- KEYS[1]: iam:resource_servers_lookup
-- KEYS[2]: iam:resource_servers_application_lookup

-- ARGV[1]: Resource Server Slug

-- It retrieves application slug
local appSlug = redis.call('HGET', KEYS[2], ARGV[1])

if not appSlug then
  return nil
end

-- It retrieves resource server slug
local rsSlug = redis.call('HGET', KEYS[1], ARGV[1])

if not rsSlug then
  return nil
end

local appHashKey = 'iam:application:' .. appSlug .. ':resource_servers'

local rsInfo = redis.call('HGET', appHashKey, rsSlug)
local rsInfoObj = cjson.decode(rsInfo)

rsInfoObj['appSlug'] = appSlug

return cjson.encode(rsInfoObj)
`;
