export * from './atp45.service';
import { Atp45Service } from './atp45.service';
export * from './auth.service';
import { AuthService } from './auth.service';
export * from './flexpart.service';
import { FlexpartService } from './flexpart.service';
export const APIS = [Atp45Service, AuthService, FlexpartService];
