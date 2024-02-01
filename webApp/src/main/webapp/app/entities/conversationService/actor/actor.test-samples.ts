import { IActor, NewActor } from './actor.model';

export const sampleWithRequiredData: IActor = {
  id: 23166,
  name: 'sternly painfully aboard',
};

export const sampleWithPartialData: IActor = {
  id: 26916,
  name: 'going ack',
};

export const sampleWithFullData: IActor = {
  id: 22005,
  name: 'ack aha bold',
};

export const sampleWithNewData: NewActor = {
  name: 'reproachfully',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
