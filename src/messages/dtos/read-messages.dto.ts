import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core-output.dto';
import { MessageEntity } from '../entities/message.entity';

@InputType()
export class ReadMessagesInput {
  @Field(() => Int)
  roomId: number;
}

@ObjectType()
export class ReadMessagesOutput extends CoreOutput {
  @Field(() => [MessageEntity], { nullable: true })
  messages: MessageEntity[] | null;
}
