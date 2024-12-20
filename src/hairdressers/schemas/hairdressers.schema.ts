import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type HairdressersDocument = HydratedDocument<Hairdressers>;

@Schema()
export class Hairdressers {
  @Prop({ type: String })
  name: string;

  @Prop(raw({
    filename: { type: String },
    mimetype: { type: String }
  }))
  image: Record<string, any>;


  @Prop(raw({
    title: { type: String },
    days: { type: Array<String> },
  }))
  weekly: Record<string, any>;

  @Prop(raw({
    title: { type: String },
    morning: { type: Array<String> },
    afternoon: { type: Array<String> },
    night: { type: Array<String> },
  }))
  time: Record<string, any>;

}

export const HairdressersSchema = SchemaFactory.createForClass(Hairdressers);