import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth.decorator';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import {
  ToggleFriendInput,
  ToggleFriendOutput,
} from './dtos/toggle-friend.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private userService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserEntity)
  async whoAmI(@CurrentUser() currentUesr: UserEntity): Promise<UserEntity> {
    return currentUesr;
  }

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.userService.createAccount(createAccountInput);
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EditProfileOutput)
  async editProfile(
    @Args('input') editProfileInput: EditProfileInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<EditProfileOutput> {
    return this.userService.editProfile(editProfileInput, currentUser);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ToggleFriendOutput)
  async toggleFriend(
    @Args('input') toggleFriendInput: ToggleFriendInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ToggleFriendOutput> {
    return this.userService.toggleFirend(toggleFriendInput, currentUser);
  }
}
