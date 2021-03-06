import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser, Roles } from 'src/auth/auth.decorator';
import { NEW_MESSAGE, PUB_SUB } from 'src/core/pubsub.constant';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateRoomInput, CreateRoomOutput } from './dtos/create-room.dto';
import {
  ReadMessagesInput,
  ReadMessagesOutput,
} from './dtos/read-messages.dto';
import { ReadRoomsOutput } from './dtos/read-rooms.dto';
import { SendMessageInput, SendMessageOutput } from './dtos/send-message.dto';
import { TakeMessageInput, TakeMessageOutput } from './dtos/take-message.dto';
import { MessagesService } from './messages.service';

@Resolver()
export class MessagesResolver {
  constructor(
    private messageService: MessagesService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  @Roles('USER')
  @Query(() => ReadRoomsOutput)
  async readRooms(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ReadRoomsOutput> {
    return this.messageService.readRooms(currentUser);
  }

  @Roles('USER')
  @Query(() => ReadMessagesOutput)
  async readMessages(
    @Args('input') readMessagesInput: ReadMessagesInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ReadMessagesOutput> {
    return this.messageService.readMessages(readMessagesInput, currentUser);
  }

  @Roles('USER')
  @Mutation(() => CreateRoomOutput)
  async createRoom(
    @Args('input') createRoomInput: CreateRoomInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CreateRoomOutput> {
    return this.messageService.createRoom(createRoomInput, currentUser);
  }

  @Roles('USER')
  @Mutation(() => SendMessageOutput)
  async sendMessage(
    @Args('input') sendMessageInput: SendMessageInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<SendMessageOutput> {
    return this.messageService.sendMessage(sendMessageInput, currentUser);
  }

  @Roles('USER')
  @Subscription(() => TakeMessageOutput, {
    filter: (
      { takeMessage }: { takeMessage: TakeMessageOutput },
      { input: { roomId } }: { input: TakeMessageInput },
    ) =>
      // { user: me }: { user: UserEntity },
      {
        return takeMessage.roomId === roomId;
      },
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async takeMessage(@Args('input') _takeMessageInput: TakeMessageInput) {
    return this.pubSub.asyncIterator(NEW_MESSAGE);
  }
}
