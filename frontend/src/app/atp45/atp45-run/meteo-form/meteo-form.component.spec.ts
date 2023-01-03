import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteoFormComponent } from './meteo-form.component';

describe('MeteoFormComponent', () => {
  let component: MeteoFormComponent;
  let fixture: ComponentFixture<MeteoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeteoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeteoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
