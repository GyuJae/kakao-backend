import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser, Roles } from 'src/auth/auth.decorator';
import { NEW_MESSAGE, PUB_SUB } from 'src/core/pubsub.constant';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateRoomInput, CreateRoomOutput } from './dtos/create-room.dto';
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
