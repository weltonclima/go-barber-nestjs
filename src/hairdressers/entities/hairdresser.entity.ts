import { BadRequestException } from "@nestjs/common";
import { CreateHairdresserDto } from "../dto/create.dto";
import { UpdateHairdresserDto } from "../dto/update.dto";
import { HairdressersDocument } from "../schemas/hairdressers.schema";

type WeeklyType = {
  title: string,
  days: string[],
}

type TimeType = {
  title: string,
  morning: string[],
  afternoon: string[],
  night: string[],
}

type ImageType = {
  filename: string;
  mimetype: string;
}

type HairdresserType = {
  id: string;
  name: string;
  image: ImageType;
  weekly: WeeklyType;
  time: TimeType;
}

export class HairdresserEntity {
  private id: string;
  private name: string;
  private image: ImageType;
  private weekly: WeeklyType;
  private time: TimeType;

  constructor(entity: HairdresserType | HairdressersDocument = {} as HairdresserType | HairdressersDocument) {
    this.Id = entity.id;
    this.Name = entity.name;
    this.Image = entity.image as ImageType;
    this.Weekly = entity.weekly as WeeklyType;
    this.Time = entity.time as TimeType;
  }

  get Id() { return this.id }
  get Name() { return this.name }
  get Image() { return this.image }
  get Weekly() { return this.weekly }
  get Time() { return this.time }

  private set Id(value: string) { this.id = value }
  private set Name(value: string) { this.name = value }
  private set Image(value: ImageType) { this.image = value }
  private set Weekly(value: WeeklyType) { this.weekly = value }
  private set Time(value: TimeType) { this.time = value }

  create(create: CreateHairdresserDto) {
    this.Name = create.name;
    this.Weekly = create.weekly;
    this.Time = create.time;

    return this;
  }

  update(update: UpdateHairdresserDto) {
    this.Id = String(update.id);
    this.Name = update.name;
    this.Weekly = update.weekly;
    this.Time = update.time;

    return this;
  }

  upload(file: Express.Multer.File) {
    this.Image = {
      filename: file.filename,
      mimetype: file.mimetype
    }

    return this;
  }

  isValid() {
    if (!this.Weekly?.days?.length)
      throw new BadRequestException("Weekly cannot be empty");

    if (
      !this.Time?.morning?.length &&
      !this.Time?.afternoon?.length &&
      !this.Time?.night?.length
    )
      throw new BadRequestException("Time cannot be empty");

    return this;
  }

  isSuccess() {
    return !!this.Id
  }

}
