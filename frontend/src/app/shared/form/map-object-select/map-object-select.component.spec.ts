import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapObjectSelectComponent } from './map-object-select.component';

describe('MapObjectSelectComponent', () => {
  let component: MapObjectSelectComponent;
  let fixture: ComponentFixture<MapObjectSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapObjectSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapObjectSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
