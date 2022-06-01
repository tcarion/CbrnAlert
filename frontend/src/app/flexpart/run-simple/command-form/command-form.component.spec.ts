import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandFormComponent } from './command-form.component';

describe('CommandFormComponent', () => {
  let component: CommandFormComponent;
  let fixture: ComponentFixture<CommandFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
