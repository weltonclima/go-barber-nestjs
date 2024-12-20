import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './guard/auth.module';
import { HairdressersModule } from './hairdressers/hairdressers.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    HairdressersModule,
    AuthModule,
    DatabaseModule,
  ],
})
export class AppModule { }
