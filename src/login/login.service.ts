import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Login } from './schemas/login.schema';
import mongoose, { Model } from 'mongoose';
import { LoginEntity } from './entities/login.entity';
import { hashSync, compareSync, genSalt, genSaltSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/guard/auth.service';
import { UpdateLoginDto } from './dto/update-login.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(Login.name) private mongoose: Model<Login>,
    private readonly authService: AuthService,
  ) { }

  async create(createLoginDto: CreateLoginDto) {

    const findUser = await this.mongoose.findOne({ email: createLoginDto.email });
    if (!!findUser)
      throw new BadRequestException('User already exists');

    const entity = new LoginEntity().create(createLoginDto).hashPassword();
    const model = await this.mongoose.create(entity);
    const doc = await model.save();

    return entity.MapToEntity(doc);
  }

  async update(updateDto: UpdateLoginDto) {
    const login = await this.mongoose.findById(updateDto.id);
    if (!login)
      throw new NotFoundException("User not found");

    const findByEmail = await this.mongoose.findOne({ email: updateDto.email });
    if (!!findByEmail && findByEmail.id != login.id)
      throw new BadRequestException("Email already exists");

    const findPassword = compareSync(updateDto.password, login.password);
    if (!findPassword)
      throw new BadRequestException("Password is incorrect");

    const entity = new LoginEntity();

    await this.mongoose.findOneAndUpdate(
      { _id: login.id }, { ...entity.update(updateDto).hashPassword() }, { new: true }
    )

    return entity.passwordIsNull();
  }

  async login({ email, password }: LoginDto) {
    const findUser = await this.mongoose.findOne({ email });
    if (!findUser)
      throw new NotFoundException("User not found");

    const findPassword = compareSync(password, findUser.password);
    if (!findPassword)
      throw new BadRequestException("Password is incorrect");

    const token = await this.authService.generateJwt({});

    return { token };
  }

  async forgetPassword(forgetPassword: ForgetPasswordDto) {
    const findUser = await this.mongoose.findOne({ email: forgetPassword.email });
    if (!findUser)
      throw new NotFoundException("User not found");

    const findPassword = compareSync(forgetPassword.password, findUser.password);
    if (!findPassword)
      throw new BadRequestException("Password is incorrect");

    const entity = new LoginEntity(findUser);

    await this.mongoose.findOneAndUpdate(
      { _id: findUser.id },
      { ...entity.hashPassword(forgetPassword['password-old']) },
      { new: true }
    );

    return entity.passwordIsNull();
  }
}
