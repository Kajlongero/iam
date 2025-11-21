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
  redis.call('EXPIRE', KEYS[2], ARGV[2])
end

if attempts > tonumber(ARGV[1]) then
  redis.call('UNLINK', KEYS[2])

  redis.call('SET', KEYS[1], 1, 'EX', ARGV[3])

  return tonumber(ARGV[3])
end

return 0
`;

export const GET_RS_VIA_MAPPED_NAME = `
-- KEYS[1]: iam:global:resource_server_names
-- ARGV[1]: clientId

-- It retrieves application clientId
local appClientId = redis.call('HGET', KEYS[1], ARGV[1])

if not appClientId then
  return nil
end

local appHashKey = 'iam:application:' .. appClientId .. ':resource_servers'

return redis.call('HGET', appHashKey, ARGV[1])
`;
