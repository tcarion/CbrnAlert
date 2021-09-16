import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseOutputComponent } from './choose-output.component';

describe('FlexpartResultComponent', () => {
  let component: ChooseOutputComponent;
  let fixture: ComponentFixture<ChooseOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
