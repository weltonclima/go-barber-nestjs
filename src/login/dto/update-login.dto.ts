import { IsEmail, IsMongoId, IsString, ValidateIf } from "class-validator";
import { CreateLoginDto } from "./create-login.dto";

export class UpdateLoginDto {
  @IsMongoId()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @ValidateIf(v => !!v['password-old'])
  @IsString()
  password: string;

  @ValidateIf(v => !!v['password'])
  @IsString()
  'password-old': string;
}