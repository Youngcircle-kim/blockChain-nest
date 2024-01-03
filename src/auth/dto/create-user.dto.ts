import { Type } from '@prisma/client';

export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  type: Type;
  nickname: string;
  wallet: string;
}
