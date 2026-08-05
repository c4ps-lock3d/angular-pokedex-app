import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandoElevationChartComponent } from './rando-elevation-chart.component';

describe('RandoElevationChartComponent', () => {
  let component: RandoElevationChartComponent;
  let fixture: ComponentFixture<RandoElevationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandoElevationChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandoElevationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
