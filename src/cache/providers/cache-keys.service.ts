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
   * Find applications by their slug
   */
  getGlobalApplicationsLookup() {
    return `iam:application:lookup`;
  }

  /**
   * Unique Application data cache key
   * @param clientId {string}
   */

  getApplicationsKey(clientId: string) {
    return `iam:application:${clientId}`;
  }

  /**
   * Retrieve information from all Application cached roles key
   * @param clientId Client id to search for
   */
  getApplicationsLocalRolesKey(clientId: string) {
    return `iam:application:${clientId}:tenant:roles`;
  }

  /**
   * Retrieve information from a specific cached role key
   * @param clientId Client id to search for
   * @param roleName Role name to retrieve specific info
   */
  getApplicationsLocalRoleByNameKey(clientId: string, roleName: string) {
    return `iam:application:${clientId}:tenant:roles:${roleName}`;
  }

  /**
   * Retrieve information of how the hierarchy of roles is on the Application key
   * @param clientId Client id to search for
   */

  getApplicationsRoleHierarchyKey(clientId: string) {
    return `iam:application:${clientId}:tenant:roles_hierarchy`;
  }

  /**
   * Retrieve information from all global cached roles key
   */
  getApplicationsGlobalRolesKey() {
    return `iam:application:global:roles`;
  }

  /**
   * Retrieve information from a specific role of the global roles cache key
   * @param roleName Role name to search for on the global roles cache key
   */
  getApplicationsGlobalRoleByNameKey(roleName: string) {
    return `iam:application:global:roles:${roleName}`;
  }

  /**
   * Retrieve information of how the hierarchy of roles is on the global cached roles key
   * @param clientId Client id to search for
   */
  getApplicationGlobalRolesHierarchyKey() {
    return `iam:application:global:roles_hierarchy`;
  }

  /**
   * Retrieve all the user permissions created (Such as permissions for users, permissions for admins, etc.) by one application key
   * @param clientId Client id to search for
   */
  getApplicationsUserPermissionsKey(clientId: string) {
    return `iam:application:${clientId}:user:permissions`;
  }

  /**
   * Retrieve a specific user permission created by one application key
   * @param clientId Client id to search for
   * @param permission Permission name to search for
   */
  getApplicationsUserPermissionsByNameKey(
    clientId: string,
    permission: string
  ) {
    return `iam:application:${clientId}:user:permissions:${permission}`;
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
   * @param clientId Client id to search for
   */
  getApplicationsApiPermissionsKey(clientId: string) {
    return `iam:application:${clientId}:api:permissions`;
  }

  /**
   * Retrieve a specific api permission created by one application key
   * @param clientId Client id to search for
   * @param permission Permission name to search for
   */
  getApplicationsApiPermissionsByNameKey(clientId: string, permission: string) {
    return `iam:application:${clientId}:api:permissions:${permission}`;
  }

  // Application registered Objects and Methods

  /**
   * Retrieve a specific information from an object created by applications key
   * @param clientId Client id to search for
   * @param objectName objectName to search for
   */
  getApplicationsObjectKey(clientId: string, objectName: string) {
    return `iam:application:${clientId}:object:${objectName}`;
  }

  /**
   * Retrieve meta object information from an object created by applications key
   * @param clientId Client id to search for
   * @param objectName objectName to search for
   */
  getApplicationsObjectMetaKey(clientId: string, objectName: string) {
    return `iam:application:${clientId}:object:${objectName}:__meta`;
  }

  /**
   * Retrieve a specific information from a method created by applications key
   * @param clientId Client id to search for
   * @param objectName Object to search for
   * @param methodName Method to search for
   */
  getApplicationsObjectMethodKey(
    clientId: string,
    objectName: string,
    methodName: string
  ) {
    return `iam:application:${clientId}:object:${objectName}:method:${methodName}`;
  }

  /**
   * Retrieve global resource server their applicattionId by their clientId
   */
  getGlobalResourceServerLookupKey() {
    return `iam:global:resource_server_names`;
  }

  /**
   * Retrieve all the application registered resource servers cached key
   * @param clientId
   * @returns
   */
  getApplicationsResourceServersKey(clientId: string) {
    return `iam:application:${clientId}:resource_servers`;
  }

  getApplicationsResourceServersNamesMappedKey(clientId: string) {
    return `iam:application:${clientId}:resource_servers_names`;
  }

  getApplicationResourceServerSlugKey(clientId: string) {
    return `iam:application:${clientId}:resource_servers_slugs`;
  }

  /**
   * Retrieve unique application resource server information cached key
   * @param clientId Client id to search for
   * @param resourceServerClientId Resource Server to search for
   */
  getApplicationsResourceServerByClientIdKey(
    clientId: string,
    resourceServerClientId: string
  ) {
    return `iam:application:${clientId}:resource_servers:${resourceServerClientId}`;
  }

  /**
   * Retrieves the SET of permissions that a specific RS exposes/offers.
   * Key: iam:application:{APP_ID}:resource_servers:{RS_ID}:exposed
   * Value: Set<string> (['invoice:create', 'user:read'])
   * @param appClientId Application client id
   * @param rsClientId Resource Server client id
   */
  getApplicationResourceServerExposedPermissionsKey(
    appClientId: string,
    rsClientId: string
  ) {
    return `iam:application:${appClientId}:resource_servers:${rsClientId}:exposed`;
  }

  /**
   * Retrieves the HASH of permissions that a Consumer is allowed to use on a Receptor.
   * Key: iam:application:{APP_ID}:resource_servers:{RECEPTOR}:consumers:{CONSUMER}
   * Value: Hash (Field: permission_name -> Value: rules_json)
   */
  getApplicationResourceServerConsumptionPermissionsKey(
    appClientId: string,
    receptorClientId: string,
    consumerClientId: string
  ) {
    return `iam:application:${appClientId}:resource_servers:${receptorClientId}:consumers:${consumerClientId}`;
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
}
