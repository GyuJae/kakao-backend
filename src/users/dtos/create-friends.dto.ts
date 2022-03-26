import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core-output.dto';

@InputType()
export class CreateFriendsInput {
  @Field(() => [Int])
  friendIds: number[];
}

@ObjectType()
export class CreateFriendsOutput extends CoreOutput {}
