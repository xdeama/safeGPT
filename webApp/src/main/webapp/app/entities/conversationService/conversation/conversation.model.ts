import dayjs from 'dayjs/esm';
import { IProvider } from 'app/entities/conversationService/provider/provider.model';
import { IMessage } from 'app/entities/conversationService/message/message.model';

export interface IConversation {
  id: number;
  startDate?: dayjs.Dayjs | null;
  provider?: Pick<IProvider, 'id'> | null;
  message?: Pick<IMessage, 'id'> | null;
}

export type NewConversation = Omit<IConversation, 'id'> & { id: null };
