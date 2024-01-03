import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckWalletDto } from './dto/check-wallet.dto';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/check')
  async checkWallet(@Res() res: Response, @Body() checkWallet: CheckWalletDto) {
    const wallet = checkWallet.wallet;
    try {
      const exWallet = await this.authService.checkWallet(wallet);

      if (exWallet) {
        return res
          .status(400)
          .json({ message: '이미 존재하는 지갑 주소입니다.', data: {} });
      }

      return res.json({ message: '사용 가능한 지갑 주소입니다.', data: {} });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: '지갑 주소 중복 확인 실패',
        data: {},
      });
    }
  }

  @Post('/signup')
  async signUp(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const result = await this.authService.signup(createUserDto);

    if (typeof result === 'string') {
      return res.status(400).json({
        message: result,
        data: {},
      });
    }

    res.status(201).json({
      message: '회원가입 성공',
      data: {
        id: +result.id.toString(),
        nickname: result.nickname,
      },
    });
  }
}
