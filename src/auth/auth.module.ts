import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule, // UsersModule 에서 export 해줘야 함!!!!!!!
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
