/* tslint:disable */
/* eslint-disable */
import { BasicAtp45Input } from './basic-atp-45-input';
import { CbrnType } from './cbrn-type';
import { WindVelocity } from './wind-velocity';
export type WindAtp45Input = BasicAtp45Input & {
'wind': WindVelocity;
} & {
'types': CbrnType;
};
