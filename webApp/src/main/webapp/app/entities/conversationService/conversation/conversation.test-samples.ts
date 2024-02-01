import dayjs from 'dayjs/esm';

import { IConversation, NewConversation } from './conversation.model';

export const sampleWithRequiredData: IConversation = {
  id: 17857,
  startDate: dayjs('2024-01-31T21:12'),
};

export const sampleWithPartialData: IConversation = {
  id: 20618,
  startDate: dayjs('2024-01-31T12:38'),
};

export const sampleWithFullData: IConversation = {
  id: 20092,
  startDate: dayjs('2024-02-01T07:28'),
};

export const sampleWithNewData: NewConversation = {
  startDate: dayjs('2024-01-31T18:32'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
