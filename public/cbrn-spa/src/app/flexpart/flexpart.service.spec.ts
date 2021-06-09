import { TestBed } from '@angular/core/testing';

import { FlexpartService } from './flexpart.service';

describe('FlexpartService', () => {
  let service: FlexpartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlexpartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
