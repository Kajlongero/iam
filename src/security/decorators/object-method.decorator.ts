import { SetMetadata } from "@nestjs/common";

export const IAMObjectKey = "IAM_OBJECT_KEY";

export const IAMMethodKey = "IAM_METHOD_KEY";

export const IAMObject = (...args: string[]) => SetMetadata(IAMObjectKey, args);

export const IAMMethod = (...args: string[]) => SetMetadata(IAMMethodKey, args);
