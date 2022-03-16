import { InputType, ObjectType, PickType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core-output.dto';
import { UserEntity } from '../entities/user.entity';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(UserEntity, ['name', 'bgImg', 'statusMessage', 'avatar'], InputType),
) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
