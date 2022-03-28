import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core-output.dto';
import { MessageEntity } from '../entities/message.entity';

@InputType()
export class ReadMessagesInput {
  @Field(() => Int)
  roomId: number;
}

@ObjectType()
class MessageUser {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  avatar: string | null;
}

@ObjectType()
class MessageWithUser extends MessageEntity {
  @Field(() => MessageUser)
  user: MessageUser;
}

@ObjectType()
export class ReadMessagesOutput extends CoreOutput {
  @Field(() => [MessageWithUser], { nullable: true })
  messages: MessageWithUser[] | null;
}
