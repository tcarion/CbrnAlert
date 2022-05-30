import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotLayerComponent } from './plot-layer.component';

describe('PlotLayerComponent', () => {
  let component: PlotLayerComponent;
  let fixture: ComponentFixture<PlotLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlotLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
