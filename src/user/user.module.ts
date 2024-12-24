import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/guard/auth.module';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          storage: diskStorage({
            destination: configService.getOrThrow("UPLOAD_FOLDER_PATH") + "/users",
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
export class UserModule { }
