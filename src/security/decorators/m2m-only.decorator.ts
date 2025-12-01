import { SetMetadata } from "@nestjs/common";

export const AUTH_M2M_ONLY_KEY = "AUTH_M2M_ONLY";

export const AuthM2MOnly = () => SetMetadata(AUTH_M2M_ONLY_KEY, true);
