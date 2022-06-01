import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgridFormComponent } from './outgrid-form.component';

describe('OutgridFormComponent', () => {
  let component: OutgridFormComponent;
  let fixture: ComponentFixture<OutgridFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutgridFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgridFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
