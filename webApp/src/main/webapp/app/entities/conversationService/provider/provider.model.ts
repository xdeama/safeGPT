import { IConversation } from 'app/entities/conversationService/conversation/conversation.model';

export interface IProvider {
  id: number;
  name?: string | null;
  conversation?: Pick<IConversation, 'id'> | null;
}

export type NewProvider = Omit<IProvider, 'id'> & { id: null };
