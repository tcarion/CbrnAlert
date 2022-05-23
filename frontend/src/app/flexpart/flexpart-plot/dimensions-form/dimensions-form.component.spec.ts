import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionsFormComponent } from './dimensions-form.component';

describe('DimensionsFormComponent', () => {
  let component: DimensionsFormComponent;
  let fixture: ComponentFixture<DimensionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DimensionsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
