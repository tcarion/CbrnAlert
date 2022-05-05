import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableSelectionComponent } from './variable-selection.component';

describe('VariableSelectionComponent', () => {
  let component: VariableSelectionComponent;
  let fixture: ComponentFixture<VariableSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariableSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
