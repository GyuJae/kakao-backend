import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core-output.dto';
import { UserEntity } from '../entities/user.entity';

@ObjectType()
export class SeeMaybeFriendsOutput extends CoreOutput {
  @Field(() => [UserEntity], { nullable: true })
  friends: UserEntity[] | null;
}
