import { TestBed } from '@angular/core/testing';

import { ApiRequestsService } from './api-requests.service';

describe('ApiRequestsService', () => {
  let service: ApiRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
