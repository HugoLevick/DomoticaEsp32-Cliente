import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { OpenAICompletionMessage } from './interfaces/openai-completion-message.interface';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  sendChat(
    @Body('messages')
    messages: OpenAICompletionMessage[],
  ) {
    return this.chatService.sendChat(messages);
  }
}
