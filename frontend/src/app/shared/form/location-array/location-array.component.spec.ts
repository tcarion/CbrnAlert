import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationArrayComponent } from './location-array.component';

describe('LocationArrayComponent', () => {
  let component: LocationArrayComponent;
  let fixture: ComponentFixture<LocationArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationArrayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
