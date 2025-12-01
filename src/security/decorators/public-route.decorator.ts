import { SetMetadata } from "@nestjs/common";

export const PUBLIC_ROUTE_KEY = "isPublic";

export const Public = () => SetMetadata("isPublic", true);
