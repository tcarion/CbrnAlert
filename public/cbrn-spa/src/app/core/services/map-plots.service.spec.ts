import { TestBed } from '@angular/core/testing';

import { MapPlotsService } from './map-plots.service';

describe('MapPlotsService', () => {
  let service: MapPlotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapPlotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
