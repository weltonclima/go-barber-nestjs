import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LoginDocument = HydratedDocument<Login>;

@Schema()
export class Login{
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  password: string;
}

export const LoginSchema = SchemaFactory.createForClass(Login);