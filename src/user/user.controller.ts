import { Controller, Post, Body, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/decorators/public.decorator';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

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
}
