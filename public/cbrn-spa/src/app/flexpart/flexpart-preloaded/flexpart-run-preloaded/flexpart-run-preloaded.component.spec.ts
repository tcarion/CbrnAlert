import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexpartRunPreloadedComponent } from './flexpart-run-preloaded.component';

describe('FlexpartRunPreloadedComponent', () => {
  let component: FlexpartRunPreloadedComponent;
  let fixture: ComponentFixture<FlexpartRunPreloadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlexpartRunPreloadedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexpartRunPreloadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
