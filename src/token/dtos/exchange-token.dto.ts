import { ArrayMaxSize, IsArray, IsOptional, IsString } from "class-validator";

export class ExchangeTokenDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  internals?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  externals?: string[];
}
