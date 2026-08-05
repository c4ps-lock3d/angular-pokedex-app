import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-rando-elevation-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './rando-elevation-chart.component.html',
  styleUrls: ['./rando-elevation-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RandoElevationChartComponent implements OnInit, OnChanges {
  @Input() trails: Array<{ id: number; ele: number; dis: number; lat: number; lon: number }> | undefined;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  
  private chartsInitialized = false;

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        display: true,
        ticks: {
          color: '#90b6db',
          autoSkip: true,
          maxTicksLimit: 20,
          callback: function(value: any) {
            return value + ' km';
          }
        },
        grid: {
          color: '#4f667d',
        },
      },
      y: {
        beginAtZero: false,
        display: true,
        ticks: {
          stepSize: 100,
          maxTicksLimit: 5,
          color: '#90b6db',
        },
        grid: {
          color: '#4f667d',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false,
        displayColors: false,
        callbacks: {
          title: function(context: any) {
            let distanceInMeters = context[0].raw.x;
            let distanceInKm = distanceInMeters.toFixed(2);
            return 'Distance : ' + distanceInKm + ' km';
          },
          label: function(context: any) {
            let label = context.dataset.label;
            if (label) {
              label += ' : ';
            }
            if (context.raw.y !== null) {
              label += new Intl.NumberFormat().format(context.raw.y);
            }
            return label + ' m';
          }
        }
      }
    },
  };

  chartData: any = {
    labels: [],
    datasets: []
  };

  ngOnInit() {
    if (this.trails && !this.chartsInitialized) {
      this.prepareChartData();
      this.chartsInitialized = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trails'] && !changes['trails'].firstChange && this.trails) {
      // Re-initialize chart if trails change
      this.prepareChartData();
    } else if (changes['trails'] && changes['trails'].firstChange && this.trails && !this.chartsInitialized) {
      // Initialize on first change
      this.prepareChartData();
      this.chartsInitialized = true;
    }
  }

  private prepareChartData() {
    if (!this.trails) return;
    const sortedTrails = [...this.trails].sort((a, b) => a.id - b.id);
    
    // Filtrer : prendre 1 valeur sur 2 pour réduire le grain
    const filteredTrails = sortedTrails.filter((_, index) => index % 20 === 0);
    
    // Créer un tableau de paires {x, y} pour utiliser une échelle linéaire
    const data = filteredTrails.map(trail => ({
      x: trail.dis,
      y: trail.ele
    }));

    this.chartData = {
      labels: [],
      datasets: [{
        label: 'Altitude',
        data: data,
        borderWidth: 2,
        borderColor: '#90b6db',
        backgroundColor: 'rgba(144, 182, 219, 0.1)',
        fill: true,
        pointStyle: 'circle' as any,
        pointRadius: 1,
        pointHoverRadius: 8,
        pointBackgroundColor: '#90b6db',
        tension: 0.3
      } as any]
    };
  }
}
