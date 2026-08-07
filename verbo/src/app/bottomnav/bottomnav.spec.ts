import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bottomnav } from './bottomnav';

describe('Bottomnav', () => {
  let component: Bottomnav;
  let fixture: ComponentFixture<Bottomnav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bottomnav],
    }).compileComponents();

    fixture = TestBed.createComponent(Bottomnav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
