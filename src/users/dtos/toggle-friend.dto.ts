import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core-output.dto';

@InputType()
export class ToggleFriendInput {
  @Field(() => Int)
  friendId: number;
}

@ObjectType()
export class ToggleFriendOutput extends CoreOutput {}
