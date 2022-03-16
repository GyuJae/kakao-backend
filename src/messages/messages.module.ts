import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';

@Module({
  providers: [MessagesResolver, MessagesService, PrismaService, AuthService],
})
export class MessagesModule {}
