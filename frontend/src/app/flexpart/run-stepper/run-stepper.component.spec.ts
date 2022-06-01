import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunStepperComponent } from './run-stepper.component';

describe('RunStepperComponent', () => {
  let component: RunStepperComponent;
  let fixture: ComponentFixture<RunStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
