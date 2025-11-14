import { Injectable } from "@nestjs/common";

@Injectable()
export class CacheKeysService {
  getGlobalApplicationsKey() {
    return `iam:global:applications`;
  }

  getGlobalRolesPermissionsKey() {
    return `iam:global:roles_permissions`;
  }

  getApplicationsKey(clientId: string) {
    return `iam:application:${clientId}`;
  }

  getApplicationsLocalRolesKey(clientId: string) {
    return `iam:application:${clientId}:tenant:roles`;
  }

  getApplicationsPlatformRolesKey(clientId: string) {
    return `iam:application:${clientId}:platform:roles`;
  }

  getApplicationsPermissionsKey(clientId: string) {
    return `iam:application:${clientId}:permissions`;
  }

  getApplicationsObjectsAndMethodsKey(clientId: string) {
    return `iam:application:${clientId}:objects_methods`;
  }

  getApplicationsRoleHierarchyKey(clientId: string) {
    return `iam:application:${clientId}:role_hierarchy`;
  }

  getApplicationsResourceServersKey(clientId: string) {
    return `iam:application:${clientId}:resource_servers`;
  }
}
