import { InputType, ObjectType } from '@nestjs/graphql';
import { PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core-output.dto';
import { UserEntity } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(
  UserEntity,
  ['email', 'name', 'password'],
  InputType,
) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
