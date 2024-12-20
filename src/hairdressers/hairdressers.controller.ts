import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile, Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { HairdressersService } from './hairdressers.service';
import { CreateHairdresserDto } from './dto/create.dto';
import { UpdateHairdresserDto } from './dto/update.dto';
import { ObjectId } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDto } from './dto/upload.dto';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (value.size > 3000000)
      return new BadRequestException("Image size is greater than 3mb")

    switch (value.mimetype) {
      case "image/png": return value;
      case "image/svg+xml": return value;
      case "image/jpeg": return value;
      case "image/jpg": return value;
      default: return new BadRequestException("Image must be PNG, SVG or JPG")
    }
  }
}

@Controller('hairdressers')
export class HairdressersController {
  constructor(private readonly service: HairdressersService) { }

  @Post()
  create(@Body() createHairdresserDto: CreateHairdresserDto) {
    return this.service.create(createHairdresserDto);
  }

  @Put()
  update(@Body() updateHairdresserDto: UpdateHairdresserDto) {
    return this.service.update(updateHairdresserDto);
  }

  @UseInterceptors(FileInterceptor("file"))
  @Put("upload")
  upload(
    @Body() upload: UploadDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.service.upload(upload, file);
  }

  @Get("download/:id")
  download(@Param("id") id: ObjectId) {
    return this.service.download(id);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.service.remove(id);
  }
}
