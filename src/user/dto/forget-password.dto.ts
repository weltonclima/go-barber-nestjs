import { IsEmail, IsString } from "class-validator";

export class ForgetPasswordDto{
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  'password-old': string;
}