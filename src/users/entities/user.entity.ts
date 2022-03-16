import { ObjectType, InputType, Field } from '@nestjs/graphql';
import { CoreEntity } from 'src/core/entities/core.entity';
import { User } from '@prisma/client';

@ObjectType()
@InputType()
export class UserEntity extends CoreEntity implements User {
  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => String, { nullable: true })
  avatar: string | null;

  @Field(() => String, { nullable: true })
  statusMessage: string | null;

  @Field(() => String, { nullable: true })
  bgImg: string | null;
}
