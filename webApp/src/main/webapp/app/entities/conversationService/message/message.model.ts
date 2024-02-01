import dayjs from 'dayjs/esm';
import { IActor } from 'app/entities/conversationService/actor/actor.model';
import { IConversation } from 'app/entities/conversationService/conversation/conversation.model';

export interface IMessage {
  id: number;
  date?: dayjs.Dayjs | null;
  textContent?: string | null;
  imageContent?: string | null;
  imageContentContentType?: string | null;
  repsonse?: Pick<IMessage, 'id'> | null;
  actor?: Pick<IActor, 'id'> | null;
  conversations?: Pick<IConversation, 'id'>[] | null;
  message?: Pick<IMessage, 'id'> | null;
}

export type NewMessage = Omit<IMessage, 'id'> & { id: null };
