export const GET_RS_VIA_MAPPED_NAME = `
local appId = redis.call('GET', KEYS[1])

if not appId then
  return nil
end

local appHashKey = 'iam:application:' .. appId .. ':resource_servers'

return redis.call('HGET', appHashKey, ARGV[1])
`;
