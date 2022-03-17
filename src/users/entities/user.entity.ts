import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Role, User } from '@prisma/client';

@ObjectType()
export class UserEntity extends CoreEntity implements User {
  @Field(() => String)
  email: string;

  @Field(() => Role)
  role: Role;

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

registerEnumType(Role, {
  name: 'Role',
  description: 'User role client or admin',
  valuesMap: {
    USER: {
      description: 'The user',
    },
    ADMIN: {
      description: 'The Admin',
    },
  },
});
