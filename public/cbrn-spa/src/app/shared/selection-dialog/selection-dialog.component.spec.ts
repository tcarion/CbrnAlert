import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionDialogComponent } from './selection-dialog.component';

describe('SelectionDialogComponent', () => {
  let component: SelectionDialogComponent;
  let fixture: ComponentFixture<SelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
