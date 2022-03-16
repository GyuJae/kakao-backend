import { ObjectType } from '@nestjs/graphql';
import { Room } from '@prisma/client';
import { CoreEntity } from 'src/core/entities/core.entity';

@ObjectType()
export class RoomEntity extends CoreEntity implements Room {}
