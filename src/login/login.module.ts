import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Login, LoginSchema } from './schemas/login.schema';
import { AuthModule } from 'src/guard/auth.module';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([{
      name: Login.name,
      schema: LoginSchema
    }])
  ]
})
export class LoginModule { }
