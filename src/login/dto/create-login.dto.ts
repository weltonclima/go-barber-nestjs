import { IsEmail, IsString } from "class-validator";

export class CreateLoginDto {
  @IsString()
  name:string;

  @IsEmail()
  email:string;

  @IsString()
  password:string;
}
