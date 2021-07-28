import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPlotListItemComponent } from './map-plot-list-item.component';

describe('MapPlotListItemComponent', () => {
  let component: MapPlotListItemComponent;
  let fixture: ComponentFixture<MapPlotListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPlotListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPlotListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
