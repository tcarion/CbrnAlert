import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSelectionComponent } from './case-selection.component';

describe('CaseSelectionComponent', () => {
  let component: CaseSelectionComponent;
  let fixture: ComponentFixture<CaseSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
