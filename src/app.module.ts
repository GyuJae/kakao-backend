import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      // subscriptions: {
      //   'subscriptions-transport-ws': {
      //     path: '/graphql',
      //     onConnect: (connectionParams) => {
      //       if (connectionParams.hasOwnProperty('x-jwt')) {
      //         return { token: connectionParams['x-jwt'] };
      //       }
      //       return {};
      //     },
      //   },
      // },
    }),
    UsersModule,
    CoreModule,
    AuthModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
