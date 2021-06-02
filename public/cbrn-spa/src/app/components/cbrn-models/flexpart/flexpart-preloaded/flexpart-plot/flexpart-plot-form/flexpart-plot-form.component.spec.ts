import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexpartPlotFormComponent } from './flexpart-plot-form.component';

describe('FlexpartPlotFormComponent', () => {
  let component: FlexpartPlotFormComponent;
  let fixture: ComponentFixture<FlexpartPlotFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlexpartPlotFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexpartPlotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
