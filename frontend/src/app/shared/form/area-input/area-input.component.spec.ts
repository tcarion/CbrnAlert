import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaInputComponent } from './area-input.component';

describe('AreaInputComponent', () => {
  let component: AreaInputComponent;
  let fixture: ComponentFixture<AreaInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
