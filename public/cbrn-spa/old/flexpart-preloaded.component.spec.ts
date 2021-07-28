import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexpartPreloadedComponent } from './flexpart-preloaded.component';

describe('FlexpartPreloadedComponent', () => {
  let component: FlexpartPreloadedComponent;
  let fixture: ComponentFixture<FlexpartPreloadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlexpartPreloadedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexpartPreloadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
