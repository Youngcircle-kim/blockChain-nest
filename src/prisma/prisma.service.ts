import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async findWallet(wallet: string) {
    return this.user.findUnique({
      where: {
        wallet: wallet,
      },
    });
  }

  async findByEmail(email: string) {
    return this.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async createUser(createUserReq: Prisma.UserCreateInput) {
    return this.user.create({
      data: {
        name: createUserReq.name,
        email: createUserReq.email,
        password: createUserReq.password,
        type: createUserReq.type,
        nickname: createUserReq.nickname,
        wallet: createUserReq.wallet,
      },
    });
  }
}
