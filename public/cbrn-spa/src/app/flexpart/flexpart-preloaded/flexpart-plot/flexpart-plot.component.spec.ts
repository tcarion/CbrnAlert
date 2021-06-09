import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexpartPlotComponent } from './flexpart-plot.component';

describe('FlexpartPlotComponent', () => {
  let component: FlexpartPlotComponent;
  let fixture: ComponentFixture<FlexpartPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlexpartPlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexpartPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
