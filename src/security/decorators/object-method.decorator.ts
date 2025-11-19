import { SetMetadata } from "@nestjs/common";

export const IAMObjectKey = "IAM_OBJECT_KEY";
export const IAMMethodKey = "IAM_METHOD_KEY";

export const Object = (...args: string[]) => SetMetadata(IAMObjectKey, args);

export const Method = (...args: string[]) => SetMetadata(IAMMethodKey, args);
