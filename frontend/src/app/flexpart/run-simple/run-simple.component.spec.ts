import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunSimpleComponent } from './run-simple.component';

describe('RunSimpleComponent', () => {
  let component: RunSimpleComponent;
  let fixture: ComponentFixture<RunSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunSimpleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
