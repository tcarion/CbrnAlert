import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseLocationsFormComponent } from './release-locations-form.component';

describe('ReleaseLocationsFormComponent', () => {
  let component: ReleaseLocationsFormComponent;
  let fixture: ComponentFixture<ReleaseLocationsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleaseLocationsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseLocationsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
