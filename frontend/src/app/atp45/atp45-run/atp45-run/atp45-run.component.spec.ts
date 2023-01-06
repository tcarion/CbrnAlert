import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Atp45RunComponent } from './atp45-run.component';

describe('Atp45RunComponent', () => {
  let component: Atp45RunComponent;
  let fixture: ComponentFixture<Atp45RunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Atp45RunComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Atp45RunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
