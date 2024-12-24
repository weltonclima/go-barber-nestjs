import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class Weekly {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsArray()
  days: string[];
}

export class Time {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsArray()
  morning: string[];

  @IsNotEmpty()
  @IsArray()
  afternoon: string[];

  @IsNotEmpty()
  @IsArray()
  night: string[];
}

export class CreateHairdresserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Weekly)
  weekly: Weekly;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Time)
  time: Time;
}
