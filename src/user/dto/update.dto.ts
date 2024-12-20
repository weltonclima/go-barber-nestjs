import { IsEmail, IsMongoId, IsString, ValidateIf } from "class-validator";

export class UpdateUserDto {
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