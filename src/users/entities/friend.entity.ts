import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Friend } from '@prisma/client';

@ObjectType()
@InputType()
export class FriendEntity extends CoreEntity implements Friend {
  @Field(() => Int)
  meId: number;
  @Field(() => Int)
  friendId: number;
}
