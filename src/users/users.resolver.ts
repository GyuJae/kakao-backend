import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CurrentUser, Roles } from 'src/auth/auth.decorator';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import {
  SearchFriendsInput,
  SearchFriendsOutput,
} from './dtos/search-friends.dto';
import { SeeFriendsOutput } from './dtos/see-friends.dto';
import { SeeMaybeFriendsOutput } from './dtos/see-maybe-friends.dto';
import {
  ToggleFriendInput,
  ToggleFriendOutput,
} from './dtos/toggle-friend.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private userService: UsersService) {}

  @ResolveField(() => Boolean)
  @Roles('Any')
  async isMe(
    @Parent() user: UserEntity,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<boolean> {
    return user.id === currentUser.id;
  }

  @ResolveField(() => Boolean)
  @Roles('USER')
  async isMyFriend(
    @Parent() user: UserEntity,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<boolean> {
    return this.userService.isMyFriend({ user, currentUser });
  }

  @Roles('USER')
  @Query(() => UserEntity)
  async whoAmI(@CurrentUser() currentUesr: UserEntity): Promise<UserEntity> {
    return currentUesr;
  }

  @Roles('USER')
  @Query(() => SeeFriendsOutput)
  async seeFriends(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<SeeFriendsOutput> {
    return this.userService.seeFriends(currentUser);
  }

  @Roles('USER')
  @Query(() => SeeMaybeFriendsOutput)
  async seeMaybeFriends(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<SeeMaybeFriendsOutput> {
    return this.userService.seeMaybeFriends(currentUser);
  }

  @Roles('USER')
  @Query(() => SearchFriendsOutput)
  async searchFriends(
    @Args('input') searchFriendsInput: SearchFriendsInput,
  ): Promise<SearchFriendsOutput> {
    return this.userService.searchFriends(searchFriendsInput);
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

  @Roles('USER')
  @Mutation(() => EditProfileOutput)
  async editProfile(
    @Args('input') editProfileInput: EditProfileInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<EditProfileOutput> {
    return this.userService.editProfile(editProfileInput, currentUser);
  }

  @Roles('USER')
  @Mutation(() => ToggleFriendOutput)
  async toggleFriend(
    @Args('input') toggleFriendInput: ToggleFriendInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ToggleFriendOutput> {
    return this.userService.toggleFirend(toggleFriendInput, currentUser);
  }
}
