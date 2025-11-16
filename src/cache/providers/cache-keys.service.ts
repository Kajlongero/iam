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

  getApplicationsPlatformRolesKey(clientId: string) {
    return `iam:application:${clientId}:platform:roles`;
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

  getApplicationsRoleHierarchyKey(clientId: string) {
    return `iam:application:${clientId}:role_hierarchy`;
  }

  getApplicationsResourceServersKey(clientId: string) {
    return `iam:application:${clientId}:resource_servers`;
  }
}
