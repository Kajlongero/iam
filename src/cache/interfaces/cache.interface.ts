import {
  Roles,
  Methods,
  Objects,
  Systems,
  Permissions,
} from "generated/prisma";

export type ISystems = Pick<
  Systems,
  "id" | "url" | "clientId" | "clientSecret" | "redirectUrl"
>;

export type IObjects = Pick<
  Objects,
  "id" | "name" | "description" | "isActive"
>;

export type IMethods = Pick<
  Methods,
  "id" | "name" | "description" | "isActive"
>;

export type IUserRoles = Pick<
  Roles,
  "id" | "name" | "isDefault" | "description" | "parentRoleId"
>;

export type IPermissions = Pick<
  Permissions,
  "id" | "name" | "description" | "isEditable" | "isGlobal"
>;

export type IPermissionsScope = {
  permissionAssignmentRule?: Pick<IUserRoles, "id" | "name">[];
} & IPermissions;

export type IRolesTree = {
  data: IUserRoles;
  parent: IUserRoles | null;
  children: IRolesTree[];
};

export type IObjectMethod = {
  methods: Map<string, IMethods>;
} & IObjects;

export type IAMCache = {
  roles: Map<string, IUserRoles>;
  system: Pick<ISystems, "clientId" | "redirectUrl">;
  objects: Map<string, IObjectMethod>;
  permissions: Map<string, IPermissionsScope>;
  rolesHierarchy: IRolesTree | null;
};

export declare type IAM = Map<string, IAMCache>;
