import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core-output.dto';

@InputType()
export class DeleteFriendInput {
  @Field(() => Int)
  friendId: number;
}

@ObjectType()
export class DeleteFriendOutput extends CoreOutput {}
