import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User{
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop(raw({
    filename: { type: String },
    mimetype: { type: String }
  }))
  image: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);