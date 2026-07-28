export interface ChatMessageDTO {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestDTO {
  message: string;
  history?: ChatMessageDTO[];
  contextProduct1Id?: string;
  contextProduct2Id?: string;
}
