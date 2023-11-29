export interface OpenAICompletionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
