import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendColorbarComponent } from './legend-colorbar.component';

describe('LegendColorbarComponent', () => {
  let component: LegendColorbarComponent;
  let fixture: ComponentFixture<LegendColorbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegendColorbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendColorbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
