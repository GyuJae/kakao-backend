import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core-output.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { RoomEntity } from '../entities/message.entity';

@ObjectType()
export class RoomWithUsers extends RoomEntity {
  @Field(() => [UserEntity])
  users: UserEntity[];
}

@ObjectType()
export class ReadRoomsOutput extends CoreOutput {
  @Field(() => [RoomWithUsers], { nullable: true })
  rooms: RoomWithUsers[] | null;
}
