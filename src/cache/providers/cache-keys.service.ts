import { Injectable } from "@nestjs/common";

@Injectable()
export class CacheKeysService {
  /**
   * All Applications cache key
   */

  getGlobalApplicationsKey() {
    return `iam:application`;
  }

  /**
   * Find applications by their client id and retrieve their app slug
   */
  getGlobalApplicationsLookupKey() {
    return `iam:application_lookup`;
  }

  /**
   * Key containing all mapped resource server client id to resource serve slug
   */
  getGlobalRsLookupKey() {
    return `iam:resource_servers_lookup`;
  }

  /**
   * Key containing all mapped resource server client id to application slug
   */
  getGlobalApplicationSlugByRsClientIdLookupKey() {
    return `iam:resource_servers_application_lookup`;
  }

  /**
   * Key that contains a hash of resource servers information
   * @param appSlug Application Unique Slug i.e IAM_CORE_0123456789abcdef
   * @example
   * "IAM_CORE_0123456789abcdef": {
   *   "RESOURCE_SERVER_A": { ...RS_INFO }
   * }
   */
  getApplicationResourceServersKey(appSlug: string) {
    return `iam:application:${appSlug}:resource_servers`;
  }

  /**
   * Key that contains a hash of resource servers plain names as their key and provides resource server slug
   * @param appSlug Application Unique Slug i.e IAM_CORE_0123456789abcdef
   */
  getApplicationResourceServerLookupKey(appSlug: string) {
    return `iam:application:${appSlug}:resource_servers_lookup`;
  }

  /**
   * Retrieves the SET of permissions that a specific RS exposes/offers.
   * Key: iam:application:{APP_ID}:resource_servers:{RS_ID}:exposed
   * Value: Set<string> (['invoice:create', 'user:read'])
   * @param appSlug Application client id
   * @param rsSlug Resource Server client id
   */
  getApplicationResourceServerExposedPermissionsKey(
    appSlug: string,
    rsSlug: string
  ) {
    return `iam:application:${appSlug}:resource_servers:${rsSlug}:exposed`;
  }

  /**
   * Retrieves the HASH of permissions that a Consumer is allowed to use on a Receptor.
   * Key: iam:application:{APP_ID}:resource_servers:{RECEPTOR}:consumers:{CONSUMER}
   * Value: Hash (Field: permission_name -> Value: rules_json)
   */
  getApplicationResourceServerConsumptionPermissionsKey(
    appSlug: string,
    receptorSlug: string,
    consumerSlug: string
  ) {
    return `iam:application:${appSlug}:resource_servers:${receptorSlug}:consumers:${consumerSlug}`;
  }

  /**
   * Retrieve information from all Application cached roles key
   * @param appSlug Application unique slug to search for
   */
  getApplicationsLocalRolesKey(appSlug: string) {
    return `iam:application:${appSlug}:roles`;
  }

  /**
   * Retrieve information of how the hierarchy of roles is on the Application key
   * @param appSlug App Slug to search for
   */

  getApplicationsRoleHierarchyKey(appSlug: string) {
    return `iam:application:${appSlug}:roles:hierarchy`;
  }

  /**
   * Retrieve information from all global cached roles key
   */
  getApplicationsGlobalRolesKey() {
    return `iam:application:global:roles`;
  }

  /**
   * Retrieve information of how the hierarchy of roles is on the global cached roles key
   */
  getApplicationGlobalRolesHierarchyKey() {
    return `iam:application:global:roles:hierarchy`;
  }

  /**
   * Retrieve the global HASH key for all Core (user) permissions metadata.
   */
  getGlobalUserPermissionsMetadataKey() {
    return `iam:global:user:permissions`;
  }

  /**
   * Retrieve the global HASH permission by their field in the metadata
   * @param permission Permission to search for
   * @returns
   */
  getGlobalUserPermissionsMetadataByNameKey(permission: string) {
    return `iam:global:user:permissions:${permission}`;
  }

  /**
   * Retrieve the global HASH key for all API (scopes) permissions metadata.
   */
  getGlobalApiPermissionsMetadataKey() {
    return `iam:global:api:permissions`;
  }

  getGlobalApiPermissionsMetadataByNameKey(permission: string) {
    return `iam:global:api:permissions:${permission}`;
  }

  /**
   * Retrieve all the API permissions created (Such as permissions for resource servers) by one application key
   * @param appSlug Application unique slug to search for
   */
  getApplicationsApiPermissionsKey(appSlug: string) {
    return `iam:application:${appSlug}:api:permissions`;
  }

  /**
   * Retrieve all the user permissions created (Such as permissions for users, permissions for admins, etc.) by one application key
   * @param appSlug Application unique slug to search for
   */
  getApplicationsUserPermissionsKey(appSlug: string) {
    return `iam:application:${appSlug}:user:permissions`;
  }

  /**
   * Retrieve a specific information from an object created by applications key
   * @param appSlug Application unique slug to search for
   * @param objectName objectName to search for
   */
  getApplicationsObjectKey(appSlug: string, objectName: string) {
    return `iam:application:${appSlug}:object:${objectName}`;
  }

  getApplicationsM2MTokensKey(appSlug: string, rsSlug: string, token: string) {
    return `iam:application:${appSlug}:resource_servers:${rsSlug}:m2m_tokens:${token}`;
  }

  /**
   * Retrieve blocked ips key for rate limit
   * @param ip IP Address
   */
  getBlockedClientsByIp(ip: string) {
    return `iam:security:rate-limit:blocked:${ip}`;
  }

  /**
   * Retrieve if a clientId is blocked for many attempts
   * @param clientId Client ID
   * @returns
   */
  getBlockedClientsByClientId(clientId: string) {
    return `iam:security:rate-limit:blocked:${clientId}`;
  }

  /**
   * Retrieve attempts of IPs to access to limited resources key
   * @param ip IP Adress
   */
  getAttemptsOfClientByIp(ip: string) {
    return `iam:security:rate-limit:attempts:${ip}`;
  }

  /**
   * Retrieve attempts to generate a exchange token from a clientId
   * @param clientId Client ID
   * @returns
   */
  getAttemptsOfClientByClientId(clientId: string) {
    return `iam:security:rate-limit:attempts:${clientId}`;
  }

  getBlacklistedTokensKey(token: string) {
    return `iam:security:blacklist:tokens:${token}`;
  }
}
