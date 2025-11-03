import {
  Matches,
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
  IsAlphanumeric,
} from "class-validator";

const PASSWORD_COMPLEXITY_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!¡@#$?&%,.+\\_]).+$/;

export class RegisterDto {
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(64)
  username: string;

  @IsString({ message: "Email must be a string" })
  @IsEmail()
  @MaxLength(255, { message: "Email must be at most 255 characters long" })
  email: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(64, { message: "Password must be at most 64 characters long" })
  @Matches(PASSWORD_COMPLEXITY_REGEX, {
    message:
      "Password must have at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  password: string;
}
