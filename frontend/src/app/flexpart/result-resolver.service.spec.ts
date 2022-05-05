import { TestBed } from '@angular/core/testing';

import { ResultResolverService } from './result-resolver.service';

describe('ResultResolverService', () => {
  let service: ResultResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
