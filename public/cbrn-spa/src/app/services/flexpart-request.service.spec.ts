import { TestBed } from '@angular/core/testing';

import { FlexpartRequestService } from './flexpart-request.service';

describe('FlexpartRequestService', () => {
  let service: FlexpartRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlexpartRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
