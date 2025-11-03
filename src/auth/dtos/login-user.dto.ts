import {
  Matches,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from "class-validator";

const PASSWORD_COMPLEXITY_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!¡@#$?&%,.+\\_]).+$/;

export class LoginDto {
  @IsNotEmpty()
  @IsString({ message: "Email must be a string" })
  @IsEmail()
  @MaxLength(255, { message: "Email must be at most 255 characters long" })
  email: string;

  @IsNotEmpty()
  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(64, { message: "Password must be at most 64 characters long" })
  @Matches(PASSWORD_COMPLEXITY_REGEX, {
    message:
      "Password must have at least one uppercase letter, one lowercase letter, one number, and one special valid character like: '@', '$', '%', '&', '?', '#', ',', '.', '+', '\\', '!', '¡' and '_'",
  })
  password: string;
}
