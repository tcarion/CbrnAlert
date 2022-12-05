export * from './atp45-api.service';
import { Atp45ApiService } from './atp45-api.service';
export * from './auth-api.service';
import { AuthApiService } from './auth-api.service';
export * from './flexpart-api.service';
import { FlexpartApiService } from './flexpart-api.service';
export const APIS = [Atp45ApiService, AuthApiService, FlexpartApiService];
