import { IsMongoId } from "class-validator";
import { ObjectId } from "mongoose";

export class UploadDto {
  @IsMongoId()
  id: ObjectId
}