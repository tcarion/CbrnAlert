import { TestBed } from '@angular/core/testing';

import { MapFormService } from './map-form.service';

describe('MapFormService', () => {
  let service: MapFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
