import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StabilityFormComponent } from './stability-form.component';

describe('StabilityFormComponent', () => {
  let component: StabilityFormComponent;
  let fixture: ComponentFixture<StabilityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StabilityFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StabilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
