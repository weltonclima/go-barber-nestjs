import { genSaltSync, hashSync } from "bcryptjs";
import { CreateLoginDto } from "../dto/create-login.dto";
import { LoginDocument } from "../schemas/login.schema";
import { UpdateLoginDto } from "../dto/update-login.dto";

export type LoginType = {
  id: number;
  name: string;
  email: string;
  password: string;
}

export class LoginEntity {
  private id: number;
  private name: string;
  private email: string;
  private password: string | null;

  constructor(entity: LoginType | LoginDocument = {} as LoginType | LoginDocument) {
    this.Id = entity.id;
    this.Name = entity.name;
    this.Email = entity.email;
    this.Password = entity.password;
  }

  get Id() { return this.id }
  get Name() { return this.name }
  get Email() { return this.email }
  get Password() { return this.password }

  private set Id(value: number) { this.id = value }
  private set Name(value: string) { this.name = value }
  private set Email(value: string) { this.email = value }
  private set Password(value: string | null) { this.password = value }

  MapToEntity(login: LoginDocument) {
    this.Id = login.id;
    this.Name = login.name;
    this.Email = login.email;
    this.Password = login.password;

    return this;
  }

  mapToRepository() {
    return {
      id: this.Id,
      name: this.Name,
      email: this.Email,
      password: this.Password,
    } as LoginType
  }

  create(user: CreateLoginDto) {
    this.Name = user.name;
    this.Email = user.email;
    this.Password = user.password;
    return this;
  }


  update(user: UpdateLoginDto) {
    this.Name = user.name;
    this.Email = user.email;
    this.Password = user["password-old"];
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