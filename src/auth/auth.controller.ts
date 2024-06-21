import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  MaxLengthPipe,
  MinLengthPipe,
  // PasswordPipe,
} from './pipe/password.pipe';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { UserModel } from 'src/users/entities/user.entity';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from './guard/bearer-token-guard';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(BasicTokenGuard)
  async login(@Headers('authorization') rawToken: string, @Request() req) {
    // const token = this.authService.extractTokenFromHeader(rawToken, false);
    // const credentials = this.authService.decodeBasicToken(token);
    const user = <UserModel>req.user;
    return this.authService.loginWithEmail(user);
  }

  @Post('register')
  async register(
    // @Body('email') email: string,
    // @Body('name') name: string,
    // @Body('password', new MaxLengthPipe(13), new MinLengthPipe(8))
    // password: string,
    @Body() body: RegisterUserDto,
  ) {
    return this.authService.registerWithEmail(body);
  }

  @Post('token/access')
  @UseGuards(AccessTokenGuard)
  // @UseGuards(RefreshTokenGuard) // 원래는 이 가드를 적용해야 하나 테스트를 위해 AccessTokenGuard 적용
  async createAccessToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newAccessToken = this.authService.rotateToken(token, false);

    return {
      asccessToken: newAccessToken,
    };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  async createRefreshToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newRefreshToken = this.authService.rotateToken(token, true);

    return {
      asccessToken: newRefreshToken,
    };
  }
}
