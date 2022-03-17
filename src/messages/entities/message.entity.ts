import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Message, Room } from '@prisma/client';
import { CoreEntity } from 'src/core/entities/core.entity';

@ObjectType()
export class RoomEntity extends CoreEntity implements Room {}

@ObjectType()
export class MessageEntity extends CoreEntity implements Message {
  @Field(() => Int)
  isReadedCount: number;

  @Field(() => String)
  payload: string;

  @Field(() => Int)
  roomId: number;

  @Field(() => Int)
  userId: number;
}
