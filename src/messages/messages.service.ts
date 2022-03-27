import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { NEW_MESSAGE, PUB_SUB } from 'src/core/pubsub.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateRoomInput, CreateRoomOutput } from './dtos/create-room.dto';
import {
  ReadMessagesInput,
  ReadMessagesOutput,
} from './dtos/read-messages.dto';
import { ReadRoomsOutput } from './dtos/read-rooms.dto';
import { SendMessageInput, SendMessageOutput } from './dtos/send-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private prismaService: PrismaService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  async readMessages(
    { roomId }: ReadMessagesInput,
    currentUser: UserEntity,
  ): Promise<ReadMessagesOutput> {
    try {
      const room = await this.prismaService.room.findUnique({
        where: {
          id: roomId,
        },
        include: {
          users: {
            select: { id: true },
          },
        },
      });
      if (!room) {
        throw new Error('This room id does not exists.');
      }
      if (!room.users.map((user) => user.id).includes(currentUser.id)) {
        throw new Error('No authorization');
      }
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        messages: null,
      };
    }
  }

  async readRooms(currentUser: UserEntity): Promise<ReadRoomsOutput> {
    try {
      const rooms = await this.prismaService.room.findMany({
        where: {
          users: {
            some: {
              id: currentUser.id,
            },
          },
        },
        include: {
          users: true,
        },
      });
      return {
        ok: true,
        error: null,
        rooms,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        rooms: null,
      };
    }
  }

  async createRoom(
    { userIds }: CreateRoomInput,
    currentUser: UserEntity,
  ): Promise<CreateRoomOutput> {
    try {
      const ids = Array.from(new Set(userIds)).map((id) => ({ id }));
      const users = await this.prismaService.user.findMany({
        where: {
          OR: ids,
        },
        select: { id: true },
      });
      const room = await this.prismaService.room.create({
        data: {
          users: {
            connect: [...users, { id: currentUser.id }],
          },
        },
      });

      return {
        ok: true,
        error: null,
        roomId: room.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        roomId: null,
      };
    }
  }

  async sendMessage(
    { roomId, payload }: SendMessageInput,
    currentUser: UserEntity,
  ): Promise<SendMessageOutput> {
    try {
      const room = await this.prismaService.room.findUnique({
        where: {
          id: roomId,
        },
        select: {
          id: true,
          users: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!room) {
        throw new Error('This room id does not exist.');
      }
      if (!room.users.map((user) => user.id).includes(currentUser.id)) {
        throw new Error('No Authorization');
      }
      const newMessage = await this.prismaService.message.create({
        data: {
          roomId: room.id,
          userId: currentUser.id,
          payload,
          isReadedCount: room.users.length - 1,
        },
        include: {
          user: true,
        },
      });
      await this.pubSub.publish(NEW_MESSAGE, { takeMessage: newMessage });
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
