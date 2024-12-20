import { IsMongoId } from 'class-validator';
import { CreateHairdresserDto } from './create.dto';
import { ObjectId } from 'mongoose';

export class UpdateHairdresserDto extends CreateHairdresserDto {
  @IsMongoId()
  id: ObjectId;
}
