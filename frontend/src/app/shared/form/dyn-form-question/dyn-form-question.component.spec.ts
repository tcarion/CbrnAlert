import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynFormQuestionComponent } from './dyn-form-question.component';

describe('DynFormQuestionComponent', () => {
  let component: DynFormQuestionComponent;
  let fixture: ComponentFixture<DynFormQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynFormQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynFormQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
