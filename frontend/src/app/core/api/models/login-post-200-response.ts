/* tslint:disable */
/* eslint-disable */
import { User } from './user';
export interface LoginPost200Response {
  expiresIn?: number;
  idToken: string;
  user: User;
}
