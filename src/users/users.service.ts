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
import {
  CreateFriendsInput,
  CreateFriendsOutput,
} from './dtos/create-friends.dto';
import { SeeFriendsOutput } from './dtos/see-friends.dto';
import { SeeMaybeFriendsOutput } from './dtos/see-maybe-friends.dto';
import {
  SearchFriendsInput,
  SearchFriendsOutput,
} from './dtos/search-friends.dto';
import {
  DeleteFriendInput,
  DeleteFriendOutput,
} from './dtos/delete-friend.dto';

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

  async createFriends(
    { friendIds }: CreateFriendsInput,
    currentUser: UserEntity,
  ): Promise<CreateFriendsOutput> {
    try {
      if (friendIds.includes(currentUser.id)) {
        throw new Error('This id mine');
      }

      for (const friend of friendIds) {
        const user = await this.prismaService.user.findUnique({
          where: {
            id: friend,
          },
          select: {
            id: true,
          },
        });
        if (!user) {
          throw new Error('this id not user');
        }
      }

      await this.prismaService.friend.createMany({
        data: friendIds.map((friend) => ({
          meId: currentUser.id,
          friendId: friend,
        })),
        skipDuplicates: true,
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

  async seeFriends(currentUser: UserEntity): Promise<SeeFriendsOutput> {
    try {
      const { myFriends } = await this.prismaService.user.findUnique({
        where: {
          id: currentUser.id,
        },
        include: {
          myFriends: {
            include: {
              friend: true,
            },
          },
        },
      });
      const friends = myFriends.map((friend) => friend.friend);
      return {
        ok: true,
        error: null,
        friends,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        friends: null,
      };
    }
  }

  async seeMaybeFriends(
    currentUser: UserEntity,
  ): Promise<SeeMaybeFriendsOutput> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: currentUser.id,
        },
        include: {
          myFriends: true,
          friendToMe: true,
        },
      });

      const maybeFriends = user.friendToMe.filter(
        (friend) => !user.myFriends.includes(friend),
      );

      const friends = await this.prismaService.friend.findMany({
        where: {
          OR: maybeFriends,
        },
        include: {
          me: true,
        },
      });

      return {
        ok: true,
        error: null,
        friends: friends.map((f) => f.me),
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        friends: null,
      };
    }
  }

  async searchFriends({
    keyword,
  }: SearchFriendsInput): Promise<SearchFriendsOutput> {
    try {
      if (keyword.length <= 1) {
        throw new Error('Keyword must longer than 1');
      }
      const users = await this.prismaService.user.findMany({
        where: {
          name: {
            contains: keyword,
          },
        },
      });
      return {
        ok: true,
        error: null,
        users,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        users: null,
      };
    }
  }

  async isMyFriend({
    user,
    currentUser,
  }: {
    user: UserEntity;
    currentUser: UserEntity;
  }): Promise<boolean> {
    try {
      const friend = await this.prismaService.friend.findUnique({
        where: {
          meId_friendId: {
            meId: currentUser.id,
            friendId: user.id,
          },
        },
        select: {
          id: true,
        },
      });
      return friend ? true : false;
    } catch {
      return false;
    }
  }

  async deleteFriend(
    { friendId }: DeleteFriendInput,
    currentUser: UserEntity,
  ): Promise<DeleteFriendOutput> {
    try {
      const friend = await this.prismaService.friend.findUnique({
        where: {
          meId_friendId: {
            meId: currentUser.id,
            friendId: friendId,
          },
        },
        select: {
          id: true,
        },
      });
      if (!friend) {
        throw new Error('This id does not exist');
      }
      await this.prismaService.friend.delete({
        where: {
          id: friend.id,
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
