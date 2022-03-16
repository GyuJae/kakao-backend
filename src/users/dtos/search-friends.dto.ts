import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core-output.dto';
import { UserEntity } from '../entities/user.entity';

@InputType()
export class SearchFriendsInput {
  @Field(() => String)
  keyword: string;
}

@ObjectType()
export class SearchFriendsOutput extends CoreOutput {
  @Field(() => [UserEntity], { nullable: true })
  users: UserEntity[] | null;
}
