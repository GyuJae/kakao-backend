import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core-output.dto';

@InputType()
export class CreateRoomInput {
  @Field(() => [Int])
  userIds: number[];
}

@ObjectType()
export class CreateRoomOutput extends CoreOutput {
  @Field(() => Int, { nullable: true })
  roomId: number | null;
}
