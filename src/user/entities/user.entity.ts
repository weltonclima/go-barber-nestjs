import { genSaltSync, hashSync } from "bcryptjs";
import { UpdateUserDto } from "../dto/update.dto";
import { CreateUserDto } from "../dto/create.dto";
import { UserDocument } from "../schemas/user.schema";

type ImageType = {
  filename: string;
  mimetype: string;
}

export type UserType = {
  id: number;
  name: string;
  email: string;
  password: string;
  image: ImageType;
}

export class UserEntity {
  private id: number;
  private name: string;
  private email: string;
  private password: string | null;
  private image: ImageType;
  constructor(entity: UserType | UserDocument = {} as UserType | UserDocument) {
    this.Id = entity.id;
    this.Name = entity.name;
    this.Email = entity.email;
    this.Password = entity.password;
    this.Image = entity.image as ImageType;
  }

  get Id() { return this.id }
  get Name() { return this.name }
  get Email() { return this.email }
  get Password() { return this.password }
  get Image() { return this.image }

  private set Id(value: number) { this.id = value }
  private set Name(value: string) { this.name = value }
  private set Email(value: string) { this.email = value }
  private set Password(value: string | null) { this.password = value }
  private set Image(value: ImageType) { this.image = value }

  MapToEntity(user: UserDocument) {
    this.Id = user.id;
    this.Name = user.name;
    this.Email = user.email;
    this.Password = user.password;

    return this;
  }

  mapToRepository() {
    return {
      id: this.Id,
      name: this.Name,
      email: this.Email,
      password: this.Password,
    } as UserType
  }

  create(user: CreateUserDto) {
    this.Name = user.name;
    this.Email = user.email;
    this.Password = user.password;
    return this;
  }


  update(user: UpdateUserDto) {
    this.Name = user.name;
    this.Email = user.email;
    this.Password = user["password-old"];
    return this;
  }

  upload(file: Express.Multer.File) {
    this.Image = {
      filename: file.filename,
      mimetype: file.mimetype
    }

    return this;
  }
  
  hashPassword(password?: string) {
    this.Password = hashSync(password ?? this.Password, genSaltSync(6));

    return this;
  }

  passwordIsNull() {
    this.Password = null;

    return this;
  }

  isSuccess() {
    return !!this.Id
  }
}