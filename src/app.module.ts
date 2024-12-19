import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './guard/auth.module';

@Module({
  imports: [LoginModule, AuthModule, DatabaseModule],
})
export class AppModule { }
