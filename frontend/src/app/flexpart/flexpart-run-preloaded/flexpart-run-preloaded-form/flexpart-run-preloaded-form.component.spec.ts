import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexpartRunPreloadedFormComponent } from './flexpart-run-preloaded-form.component';

describe('FlexpartRunPreloadedFormComponent', () => {
  let component: FlexpartRunPreloadedFormComponent;
  let fixture: ComponentFixture<FlexpartRunPreloadedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlexpartRunPreloadedFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexpartRunPreloadedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
