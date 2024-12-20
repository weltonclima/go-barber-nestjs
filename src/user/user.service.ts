import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compareSync } from 'bcryptjs';
import { AuthService } from 'src/guard/auth.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private mongoose: Model<User>,
    private readonly authService: AuthService,
  ) { }

  async create(createUserDto: CreateUserDto) {

    const findUser = await this.mongoose.findOne({ email: createUserDto.email });
    if (!!findUser)
      throw new BadRequestException('User already exists');

    const entity = new UserEntity().create(createUserDto).hashPassword();
    const model = await this.mongoose.create(entity);
    const doc = await model.save();

    return entity.MapToEntity(doc);
  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.mongoose.findById(updateUserDto.id);
    if (!user)
      throw new NotFoundException("User not found");

    const findByEmail = await this.mongoose.findOne({ email: updateUserDto.email });
    if (!!findByEmail && findByEmail.id != user.id)
      throw new BadRequestException("Email already exists");

    const findPassword = compareSync(updateUserDto.password, user.password);
    if (!findPassword)
      throw new BadRequestException("Password is incorrect");

    const entity = new UserEntity();

    await this.mongoose.findOneAndUpdate(
      { _id: user.id }, { ...entity.update(updateUserDto).hashPassword() }, { new: true }
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

    const entity = new UserEntity(findUser);

    await this.mongoose.findOneAndUpdate(
      { _id: findUser.id },
      { ...entity.hashPassword(forgetPassword['password-old']) },
      { new: true }
    );

    return entity.passwordIsNull();
  }
}
