import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreloadedFormComponent } from './preloaded-form.component';

describe('PreloadedFormComponent', () => {
  let component: PreloadedFormComponent;
  let fixture: ComponentFixture<PreloadedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreloadedFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreloadedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
