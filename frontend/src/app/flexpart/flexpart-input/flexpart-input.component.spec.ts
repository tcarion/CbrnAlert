import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexpartInputComponent } from './flexpart-input.component';

describe('FlexpartInputComponent', () => {
  let component: FlexpartInputComponent;
  let fixture: ComponentFixture<FlexpartInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlexpartInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexpartInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
