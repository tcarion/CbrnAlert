import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapObjectInputComponent } from './map-object-input.component';

describe('MapObjectInputComponent', () => {
  let component: MapObjectInputComponent;
  let fixture: ComponentFixture<MapObjectInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapObjectInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapObjectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
