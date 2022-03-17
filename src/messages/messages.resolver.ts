import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser, Roles } from 'src/auth/auth.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateRoomInput, CreateRoomOutput } from './dtos/create-room.dto';
import { SendMessageInput, SendMessageOutput } from './dtos/send-message.dto';
import { MessagesService } from './messages.service';

@Resolver()
export class MessagesResolver {
  constructor(private messageService: MessagesService) {}

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
}
