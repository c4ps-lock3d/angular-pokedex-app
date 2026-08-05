import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandoMapComponent } from './rando-map.component';

describe('RandoMapComponent', () => {
  let component: RandoMapComponent;
  let fixture: ComponentFixture<RandoMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandoMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandoMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
