import { Injectable } from "@nestjs/common";

@Injectable()
export class CacheKeysService {
  getGlobalApplicationsKey() {
    return `iam:application`;
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

  getApplicationsGlobalRolesKey() {
    return `iam:application:global:roles`;
  }

  getApplicationGlobalRolesHierarchyKey() {
    return `iam:application:global:role_hierarchy`;
  }

  getApplicationsRoleHierarchyKey(clientId: string) {
    return `iam:application:${clientId}:tenant:role_hierarchy`;
  }

  getApplicationsLocalRoleByNameKey(clientId: string, roleName: string) {
    return `iam:application:${clientId}:tenant:roles:${roleName}`;
  }

  getApplicationsPlatformRolesKey(clientId: string) {
    return `iam:application:${clientId}:platform:roles`;
  }

  getApplicationsPlatformRoleByNameKey(clientId: string, roleName: string) {
    return `iam:application:${clientId}:platform:roles:${roleName}`;
  }

  getApplicationsPermissionsKey(clientId: string) {
    return `iam:application:${clientId}:permissions`;
  }

  getApplicationsObjectKey(clientId: string, objectName: string) {
    return `iam:application:${clientId}:object:${objectName}`;
  }

  getApplicationsObjectMethodKey(
    clientId: string,
    objectName: string,
    methodName: string
  ) {
    return `iam:application:${clientId}:object:${objectName}:method:${methodName}`;
  }

  getApplicationsResourceServersKey(clientId: string) {
    return `iam:application:${clientId}:resource_servers`;
  }
}
