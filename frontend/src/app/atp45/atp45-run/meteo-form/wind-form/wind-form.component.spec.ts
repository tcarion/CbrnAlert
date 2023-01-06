import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindFormComponent } from './wind-form.component';

describe('WindFormComponent', () => {
  let component: WindFormComponent;
  let fixture: ComponentFixture<WindFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
