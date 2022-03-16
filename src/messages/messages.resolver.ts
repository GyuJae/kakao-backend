import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth.decorator';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateRoomInput, CreateRoomOutput } from './dtos/create-room.dto';
import { SendMessageInput, SendMessageOutput } from './dtos/send-message.dto';
import { MessagesService } from './messages.service';

@Resolver()
export class MessagesResolver {
  constructor(private messageService: MessagesService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CreateRoomOutput)
  async createRoom(
    @Args('input') createRoomInput: CreateRoomInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CreateRoomOutput> {
    return this.messageService.createRoom(createRoomInput, currentUser);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SendMessageOutput)
  async sendMessage(
    @Args('input') sendMessageInput: SendMessageInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<SendMessageOutput> {
    return this.messageService.sendMessage(sendMessageInput, currentUser);
  }
}
