import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import * as bcrypt from 'bcrypt';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { AuthService } from 'src/auth/auth.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

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

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          password: true,
        },
      });
      if (!user) {
        throw new Error('This email does not exists');
      }
      const isCompare = await bcrypt.compare(password, user.password);
      if (!isCompare) {
        throw new Error('This password is wrong');
      }
      const { token } = await this.authService.sign({ userId: user.id });
      return {
        ok: true,
        error: null,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        token: null,
      };
    }
  }

  async editProfile(
    editProfileInput: EditProfileInput,
    currentUser: UserEntity,
  ): Promise<EditProfileOutput> {
    try {
      await this.prismaService.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          ...editProfileInput,
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
