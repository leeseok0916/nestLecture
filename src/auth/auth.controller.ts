import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  MaxLengthPipe,
  MinLengthPipe,
  // PasswordPipe,
} from './pipe/password.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);
    return this.authService.loginWithEmail(credentials);
  }

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('name') name: string,
    // @Body('password', PasswordPipe) password: string,
    @Body('password', new MaxLengthPipe(13), new MinLengthPipe(8))
    // @Body('password', MaxLengthPipe, MinLengthPipe)
    password: string,
  ) {
    return this.authService.registerWithEmail({ email, name, password });
  }

  @Post('token/access')
  async createAccessToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newAccessToken = this.authService.rotateToken(token, false);

    return {
      asccessToken: newAccessToken,
    };
  }

  @Post('token/refresh')
  async createRefreshToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newRefreshToken = this.authService.rotateToken(token, true);

    return {
      asccessToken: newRefreshToken,
    };
  }
}
