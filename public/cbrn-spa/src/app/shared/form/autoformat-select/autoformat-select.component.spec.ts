import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoformatSelectComponent } from './autoformat-select.component';

describe('AutoformatSelectComponent', () => {
  let component: AutoformatSelectComponent;
  let fixture: ComponentFixture<AutoformatSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoformatSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoformatSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
