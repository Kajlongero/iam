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
  "id" | "name" | "isDefault" | "description"
>;

export type IPermissions = Pick<
  Permissions,
  "id" | "name" | "description" | "isEditable" | "isGlobal"
>;

export type IPermissionsScope = {
  minimumRole?: Pick<IUserRoles, "id" | "name">[];
} & IPermissions;

export type IRolesNode = {
  data: IUserRoles;
  parent: IUserRoles | null;
  children: IUserRoles[];
};

export type IObjectMethod = {
  methods: Map<string, IMethods>;
} & IObjects;

export type IAMCache = {
  roles: null;
  system: Pick<ISystems, "clientId" | "redirectUrl">;
  objects: Map<string, IObjectMethod>;
  permissions: Map<string, IPermissionsScope>;
};

export declare type IAM = Map<string, IAMCache>;
