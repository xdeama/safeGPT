import { IProvider, NewProvider } from './provider.model';

export const sampleWithRequiredData: IProvider = {
  id: 6608,
  name: 'worth silver',
};

export const sampleWithPartialData: IProvider = {
  id: 16401,
  name: 'absent helplessly',
};

export const sampleWithFullData: IProvider = {
  id: 14711,
  name: 'baulk tumbler quizzically',
};

export const sampleWithNewData: NewProvider = {
  name: 'surprisingly arrogantly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
