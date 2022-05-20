import { TestBed } from '@angular/core/testing';

import { ApiService_old } from './api.service';

describe('ApiService', () => {
  let service: ApiService_old;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService_old);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
