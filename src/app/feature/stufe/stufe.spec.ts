import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stufe } from './stufe';

describe('Stufe', () => {
  let component: Stufe;
  let fixture: ComponentFixture<Stufe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stufe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stufe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
