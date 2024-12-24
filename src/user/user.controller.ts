import { Controller, Post, Body, Put, UseInterceptors, UploadedFile, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/decorators/public.decorator';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDto } from './dto/upload.dto';
import { ObjectId } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) { }

  @Public()
  @Post()
  create(@Body() createuserDto: CreateUserDto) {
    return this.service.create(createuserDto);
  }

  @Public()
  @Post("auth")
  login(@Body() loginDto: LoginDto) {
    return this.service.login(loginDto);
  }

  @Public()
  @Put("forgetPassword")

  forgetPassword(@Body() userDto: ForgetPasswordDto) {
    return this.service.forgetPassword(userDto);
  }

  @Put()
  update(@Body() updateuserDto: UpdateUserDto) {
    return this.service.update(updateuserDto);
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

}
