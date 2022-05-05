import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputFormComponent } from './output-form.component';

describe('OutputFormComponent', () => {
  let component: OutputFormComponent;
  let fixture: ComponentFixture<OutputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
