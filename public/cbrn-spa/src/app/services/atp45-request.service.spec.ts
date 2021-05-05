import { TestBed } from '@angular/core/testing';

import { Atp45RequestService } from './atp45-request.service';

describe('Atp45RequestService', () => {
  let service: Atp45RequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Atp45RequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
