import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async createAccount({
    email,
    password,
    name,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const emailExist = await this.prismaService.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });
      if (emailExist) {
        throw new Error('This email alread exists.');
      }
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      await this.prismaService.user.create({
        data: {
          email,
          password: hashPassword,
          name,
        },
      });
      return {
        ok: true,
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
