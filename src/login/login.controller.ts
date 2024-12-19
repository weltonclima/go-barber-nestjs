import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/decorators/public.decorator';
import { UpdateLoginDto } from './dto/update-login.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Public()
  @Post()
  create(@Body() createLoginDto: CreateLoginDto) {
    return this.loginService.create(createLoginDto);
  }

  @Public()
  @Post("auth")
  login(@Body() loginDto: LoginDto) {
    return this.loginService.login(loginDto);
  }

  @Public()
  @Put("forgetPassword")
  forgetPassword(@Body() loginDto: ForgetPasswordDto) {
    return this.loginService.forgetPassword(loginDto);
  }

  @Put()
  update(@Body() updateLoginDto: UpdateLoginDto) {
    return this.loginService.update(updateLoginDto);
  }
}
