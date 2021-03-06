import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CoreEntity {
  @Field(() => Int)
  id: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
