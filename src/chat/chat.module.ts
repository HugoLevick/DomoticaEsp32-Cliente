import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from 'src/app.module';

@Module({
  imports: [ConfigModule.forRoot({}), forwardRef(() => AppModule)],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
