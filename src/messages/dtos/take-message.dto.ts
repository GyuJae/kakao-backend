import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'src/users/entities/user.entity';
import { MessageEntity } from '../entities/message.entity';

@InputType()
export class TakeMessageInput {
  @Field(() => Int)
  roomId: number;
}

@ObjectType()
export class TakeMessageOutput extends MessageEntity {
  @Field(() => UserEntity)
  user: UserEntity;
}
