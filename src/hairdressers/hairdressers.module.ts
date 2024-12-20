import { Module } from '@nestjs/common';
import { HairdressersService } from './hairdressers.service';
import { HairdressersController } from './hairdressers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hairdressers, HairdressersSchema } from './schemas/hairdressers.schema';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from "multer";

@Module({
  controllers: [HairdressersController],
  providers: [HairdressersService],
  imports: [
    MongooseModule.forFeature([{
      name: Hairdressers.name,
      schema: HairdressersSchema
    }]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          storage: diskStorage({
            destination: configService.getOrThrow("UPLOAD_FOLDER_PATH"),
            filename(req, file, callback) {
              const originalname = file.originalname.split('.')
              const filename = `${req.body['id']}.${originalname[originalname.length - 1]}`
              callback(null, filename)
            },
          })
        }
      },
      inject: [ConfigService]
    })
  ]
})
export class HairdressersModule { }
