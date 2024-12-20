import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/guard/auth.module';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }])
  ]
})
export class UserModule { }
