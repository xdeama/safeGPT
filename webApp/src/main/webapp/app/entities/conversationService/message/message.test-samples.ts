import dayjs from 'dayjs/esm';

import { IMessage, NewMessage } from './message.model';

export const sampleWithRequiredData: IMessage = {
  id: 15475,
  date: dayjs('2024-01-31T15:30'),
};

export const sampleWithPartialData: IMessage = {
  id: 20914,
  date: dayjs('2024-01-31T14:24'),
  textContent: 'revolution',
  imageContent: '../fake-data/blob/hipster.png',
  imageContentContentType: 'unknown',
};

export const sampleWithFullData: IMessage = {
  id: 16953,
  date: dayjs('2024-02-01T07:01'),
  textContent: 'uh-huh remunerate',
  imageContent: '../fake-data/blob/hipster.png',
  imageContentContentType: 'unknown',
};

export const sampleWithNewData: NewMessage = {
  date: dayjs('2024-01-31T17:07'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
