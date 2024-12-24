import { BadRequestException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { compareSync } from 'bcryptjs';
import { AuthService } from 'src/guard/auth.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update.dto';
import { UploadDto } from './dto/upload.dto';
import { createReadStream } from 'fs';

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

  async upload({ id }: UploadDto, file: Express.Multer.File) {
    const find = await this.mongoose.findById(id);
    if (!find)
      throw new NotFoundException("User not found");

    const entity = new UserEntity(find);

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
      throw new NotFoundException("user not found");

    const file = createReadStream(`${process.env.UPLOAD_FOLDER_PATH}/users/${find.image.filename}`);
    const stream = new StreamableFile(file, {
      type: find.image.mimetype
    });

    return stream;
  }

  async findOne(id: ObjectId) {
    const findOne = await this.mongoose.findOne({ _id: id });
    if (!findOne)
      throw new NotFoundException("User not found");

    return new UserEntity(findOne).passwordIsNull();
  }


  async findAll() {
    const findAll = await this.mongoose.find();
    if (!findAll.length)
    throw new NotFoundException("Hairdressers not found");

    return findAll.map(item => new UserEntity(item).passwordIsNull());
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
