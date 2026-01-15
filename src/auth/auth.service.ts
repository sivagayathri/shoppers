import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignInDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ access_token: string } | { error: string }> {
    const result = await this.usersService.signIn(signInDto);

    if ('error' in result) {
      throw new UnauthorizedException(result.error);
    }

    const payload = { sub: result.id, username: result.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
