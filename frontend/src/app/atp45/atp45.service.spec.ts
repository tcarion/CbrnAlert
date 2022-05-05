import { TestBed } from '@angular/core/testing';

import { Atp45Service } from './atp45.service';

describe('Atp45Service', () => {
  let service: Atp45Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Atp45Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
