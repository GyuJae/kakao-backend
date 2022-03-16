import { InputType, PickType, ObjectType, Field } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core-output.dto';
import { UserEntity } from '../entities/user.entity';

@InputType()
export class LoginInput extends PickType(
  UserEntity,
  ['email', 'password'],
  InputType,
) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(() => String, { nullable: true })
  token: string | null;
}
