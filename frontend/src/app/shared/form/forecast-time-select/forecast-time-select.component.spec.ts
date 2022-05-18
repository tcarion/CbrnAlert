import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastTimeSelectComponent } from './forecast-time-select.component';

describe('ForecastTimeSelectComponent', () => {
  let component: ForecastTimeSelectComponent;
  let fixture: ComponentFixture<ForecastTimeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForecastTimeSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastTimeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
