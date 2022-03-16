import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core-output.dto';

@InputType()
export class SendMessageInput {
  @Field(() => Int)
  roomId: number;

  @Field(() => String)
  payload: string;
}

@ObjectType()
export class SendMessageOutput extends CoreOutput {}
