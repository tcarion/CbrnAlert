import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveMeteoSimpleComponent } from './retrieve-meteo-simple.component';

describe('RetrieveMeteoSimpleComponent', () => {
  let component: RetrieveMeteoSimpleComponent;
  let fixture: ComponentFixture<RetrieveMeteoSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetrieveMeteoSimpleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveMeteoSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
