import { Body, Controller, Post, Headers, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModel } from 'src/users/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { BasicTokenGuard } from './guard/basic-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @IsPublic()
  @UseGuards(BasicTokenGuard)
  async login(@Headers('authorization') rawToken: string, @Request() req) {
    // const token = this.authService.extractTokenFromHeader(rawToken, false);
    // const credentials = this.authService.decodeBasicToken(token);
    const user = <UserModel>req.user;
    return this.authService.loginWithEmail(user);
  }

  @Post('register')
  @IsPublic()
  async register(@Body() body: RegisterUserDto) {
    return this.authService.registerWithEmail(body);
  }

  @Post('token/access')
  @IsPublic()
  async createAccessToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newAccessToken = this.authService.rotateToken(token, false);

    return {
      asccessToken: newAccessToken,
    };
  }

  @Post('token/refresh')
  @IsPublic()
  async createRefreshToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newRefreshToken = this.authService.rotateToken(token, true);

    return {
      asccessToken: newRefreshToken,
    };
  }
}
