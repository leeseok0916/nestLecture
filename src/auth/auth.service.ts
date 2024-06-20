import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JWT_SECRET } from './const/auth.const';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  /**
   * 1. registerWithEmail
   *   - email, name, password 입력받아서 사용자 생성
   *   - access token, refresh token 반환
   *   - 회원 가입 후 자동 로그인
   *
   * 2. loginWithEmail
   *   - email, password 입력받아서 사용자 검증
   *   - access token, refresh token 반환
   *
   * 3. loginUser
   *   - 1과 2에서 필요한 access token, refresh token 반환하는 로직
   *
   * 4. signToken
   *   - 3에서 필요한 access token, refresh token 을 sign 하는 로직
   *
   * 5. authenticateWithEmailAndPassword
   *   - 2에서 로그인을 진행할 때 필요한 기본적인 검증 진행
   *   - 사용자가 존재하는지, 비밀번호가 일치하는지
   *   - 모두 통과되면 사용자 정보 반환
   *   - loginWithEmail 에서 반환된 데이터를 기반으로 토큰 생성
   *
   */

  /**
   * 토큰을 생성합니다.
   */
  signToken(
    user: Pick<UserModel, 'email' | 'id'>,
    isRefreshToken: boolean = false,
  ) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300, // 만료일자
    });
  }

  /**
   * 액세스 토큰과 리프레시 토큰을 반환합니다.
   *
   * @param user - 이메일과 ID를 포함한 사용자 객체입니다.
   * @returns 액세스 토큰과 리프레시 토큰을 포함한 객체를 반환합니다.
   */
  async loginUser(user: Pick<UserModel, 'email' | 'id'>) {
    const accessToken = this.signToken(user, false);
    const refreshToken = this.signToken(user, true);

    return {
      accessToken,
      refreshToken,
    };
  }

  /*
   * 이메일과 비밀번호로 사용자를 인증합니다.
   *
   * @param user - 이메일과 비밀번호를 포함한 사용자 객체입니다.
   * @returns 사용자 정보를 반환합니다.
   */
  async authenticateWithEmailAndPassword(
    user: Pick<UserModel, 'email' | 'password'>,
  ) {
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('사용자가 존재하지 않습니다.');
    }

    const passOk = await bcrypt.compare(user.password, existingUser.password);

    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return existingUser;
  }

  /**
   * 이메일과 비밀번호로 로그인합니다.
   * @param user - 이메일과 비밀번호를 포함한 사용자 객체입니다.
   * @returns 사용자 정보를 반환합니다.
   * @throws 사용자가 존재하지 않거나 비밀번호가 일치하지 않을 경우 예외가 발생합니다.
   */
  async loginWithEmail(user: Pick<UserModel, 'email' | 'id'>) {
    // const existingUser = await this.authenticateWithEmailAndPassword(user);
    return this.loginUser(user);
  }

  /**
   * 이메일로 회원가입합니다.
   * @param user - 이메일, 이름, 비밀번호를 포함한 사용자 객체입니다.
   * @returns 사용자 정보를 반환합니다.
   * @throws 사용자가 이미 존재할 경우 예외가 발생합니다.
   */
  async registerWithEmail(
    user: Pick<UserModel, 'email' | 'name' | 'password'>,
  ) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt); // hash 라운드
    user.password = hashedPassword;
    const createdUser = await this.usersService.create(user);

    return this.loginUser(createdUser);
  }

  /*
   * 6. 토큰을 사용하게 되는 방ㅅ힉
   *  1) 사용자가 로그인 또는 회원 가입을 진행하면 액세스 토큰, 리프레시 토큰을 발급 받는다.
   *  2) 로그인 할 때는 Basic 토큰과 함께 요청을 보낸다.
   *    - Basic 토큰은 '이메일:비밀번호'를 base64로 인코딩한 값이다. 예) 'Basic bWF0dEBnbWFpbC5jb206cGFzc3dvcmQ='
   *  3) 아무나 접근할 수 없는 정보를 접근할 때는 액세스 토큰을 헤더에 담아서 요청을 보낸다.
   *   - 'Authorization: Bearer '액세스토큰'
   *  4) 토근과 요청을 함께 받은 서버는 토큰을 검증을 통해 현재 요청을 보낸 사용자가 누구인지 알 수 있다.
   *  5) 토큰의 만료기간이 지나면 새로 토큰을 발급 받아야 한다.
   *   - jwtService.verify()
   *   - 액세스 토큰을 새로 발급받는 /auth/token/access - 액세스 토큰은 리프레시 토큰을 통해 발급받는다.
   *   - 리프레시 토큰을 새로 발급받는 /auth/token/refresh - 리프레시 토큰은 리프레시 토큰을 통해 발급받는다. -> 다시 로그인해서 받아야 하지 않나????
   *  6) 새로 발급받은 토큰을 사용하여 요청을 보낸다.
   */

  /**
   * 헤더에서 토큰을 추출합니다.
   *
   * @param header - 헤더 문자열입니다.
   * @param isBearer - Bearer 토큰인지 여부입니다.
   * @returns 추출된 토큰을 반환합니다.
   * @throws 토큰이 올바르지 않을 경우 예외가 발생합니다.
   */
  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }

    return splitToken[1];
  }

  decodeBasicToken(token: string) {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }

    return {
      email: split[0],
      password: split[1],
    };
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token, {
      // secret: JWT_SECRET,
      secret: 'lllllsssss00009999',
    });
  }

  /**
   * 토큰을 새로 발급합니다.
   *
   * @param token - 토큰입니다.
   * @returns 새로 발급된 액세스 토큰을 반환합니다.
   * @throws 토큰이 올바르지 않을 경우 예외가 발생합니다.
   */
  rotateToken(token: string, isRefreshToken: boolean) {
    const payload = this.verifyToken(token);

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException(
        'access token 재발급은 refresh token으로만 가능합니다.',
      );
    }

    return this.signToken(
      { email: payload.email, id: payload.sub },
      isRefreshToken,
    );
  }
}
