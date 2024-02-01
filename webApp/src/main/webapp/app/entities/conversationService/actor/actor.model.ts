import { IMessage } from 'app/entities/conversationService/message/message.model';

export interface IActor {
  id: number;
  name?: string | null;
  message?: Pick<IMessage, 'id'> | null;
}

export type NewActor = Omit<IActor, 'id'> & { id: null };
