import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPlotListComponent } from './map-plot-list.component';

describe('MapPlotListComponent', () => {
  let component: MapPlotListComponent;
  let fixture: ComponentFixture<MapPlotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPlotListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPlotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
