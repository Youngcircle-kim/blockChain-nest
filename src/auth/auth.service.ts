import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async checkWallet(wallet: string) {
    return this.prisma.findWallet(wallet);
  }

  async signup(createUserDto: CreateUserDto) {
    const { email, password, name, type, nickname, wallet } = createUserDto;
    const salt = await bcrypt.genSalt();
    try {
      const exUser = await this.prisma.findByEmail(email);
      if (exUser) {
        return '이미 존재하는 이메일입니다';
      }
      const hash = await bcrypt.hash(password, salt);

      const newUser = await this.prisma.createUser({
        email,
        password: hash,
        name,
        type,
        nickname,
        wallet,
      });
      return newUser;
    } catch (err) {
      console.error(err);
      return '회원가입 실패';
    }
  }

  async signin(signInDto: SignInDto) {
    const { email, password } = signInDto;
  }

  getAccessToken({ user }): string {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      {
        secret: this.configService.get('ACCESS_TOKEN_SECRET_KEY'),
        expiresIn: '5m',
      },
    );
  }

  setRefreshToken({ user, res }) {
    //ToDo Refresh token generate
  }
}
