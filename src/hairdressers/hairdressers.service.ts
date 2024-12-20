import { BadRequestException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { CreateHairdresserDto } from './dto/create.dto';
import { UpdateHairdresserDto } from './dto/update.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Hairdressers } from './schemas/hairdressers.schema';
import { HairdresserEntity } from './entities/hairdresser.entity';
import { UploadDto } from './dto/upload.dto';
import { createReadStream } from 'fs';

@Injectable()
export class HairdressersService {
  constructor(
    @InjectModel(Hairdressers.name) private mongoose: Model<Hairdressers>,
  ) { }

  async create(createHairdresserDto: CreateHairdresserDto) {
    const entity = new HairdresserEntity().create(createHairdresserDto).isValid();
    const model = await this.mongoose.create(entity);
    const doc = await model.save();
    return new HairdresserEntity(doc);
  }

  async update(updateHairdresserDto: UpdateHairdresserDto) {
    const find = await this.mongoose.findById(updateHairdresserDto.id);
    if (!find)
      throw new NotFoundException("Hairdresser not found");

    const entity = new HairdresserEntity(find).update(updateHairdresserDto).isValid();

    await this.mongoose.findOneAndUpdate(
      { _id: updateHairdresserDto.id },
      { ...entity },
      { new: true }
    )

    return entity;
  }

  async upload({ id }: UploadDto, file: Express.Multer.File) {
    const find = await this.mongoose.findById(id);
    if (!find)
      throw new NotFoundException("Hairdresser not found");

    const entity = new HairdresserEntity(find);

    await this.mongoose.findOneAndUpdate(
      { _id: id },
      { ...entity.upload(file) },
      { new: true }
    )

    return entity;
  }

  async download(id: ObjectId) {
    const find = await this.mongoose.findById(id);
    if (!find)
      throw new NotFoundException("Hairdresser not found");

    const file = createReadStream(`${process.env.UPLOAD_FOLDER_PATH}/${find.image.filename}`);
    const stream = new StreamableFile(file, {
      type: find.image.mimetype
    });

    return stream;
  }

  async findAll() {
    const findAll = await this.mongoose.find();
    if (!findAll.length)
    throw new NotFoundException("Hairdressers not found");

    return findAll.map(item => new HairdresserEntity(item));
  }

  async findOne(id: ObjectId) {
    const findOne = await this.mongoose.findOne({ _id: id });
    if (!findOne)
      throw new NotFoundException("Hairdresser not found");

    return new HairdresserEntity(findOne);
  }

  async remove(id: ObjectId) {
    const remove = await this.mongoose.findOneAndDelete({ _id: id });
    if (!remove)
      throw new BadRequestException("Error deleting");

    return new HairdresserEntity(remove);
  }
}
