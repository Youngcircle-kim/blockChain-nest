import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
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
}
