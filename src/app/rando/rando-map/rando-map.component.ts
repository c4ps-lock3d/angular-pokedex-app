import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import * as L from 'leaflet';

// Configurer Leaflet pour utiliser les images du dossier public
L.Icon.Default.mergeOptions({
  iconUrl: '/assets/leaflet/marker-icon.png',
  iconRetinaUrl: '/assets/leaflet/marker-icon-2x.png',
  shadowUrl: '/assets/leaflet/marker-shadow.png',
  shadowRetinaUrl: '/assets/leaflet/marker-shadow-2x.png'
});

@Component({
  selector: 'app-rando-map',
  imports: [],
  templateUrl: './rando-map.component.html',
  styleUrl: './rando-map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RandoMapComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() trails: Array<{ id: number; ele: number; dis: number; lat: number; lon: number }> | undefined;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map: L.Map | null = null;
  private mapInitialized = false;

  ngAfterViewInit() {
    if (this.trails && this.mapContainer && !this.mapInitialized) {
      this.initializeMap();
      this.mapInitialized = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trails'] && this.mapContainer && !changes['trails'].firstChange) {
      // Re-initialize map if trails change after initial load
      if (this.map) {
        this.map.remove();
        this.map = null;
        this.mapInitialized = false;
      }
      this.initializeMap();
      this.mapInitialized = true;
    } else if (changes['trails'] && this.mapContainer && changes['trails'].firstChange && this.trails) {
      // Initialize on first change if view is ready
      this.initializeMap();
      this.mapInitialized = true;
    }
  }

  private initializeMap() {
    if (!this.trails || this.trails.length === 0) return;

    console.log('Initializing map with', this.trails.length, 'trails');

    // Créer la carte
    this.map = L.map(this.mapContainer.nativeElement, {
      crs: (L as any).CRS.EPSG3857,
      attributionControl: false,
      zoomControl: true,
    });

    // Couches de tuiles Swisstopo
    const pixelkarteGrau = L.tileLayer('https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg');
    const pixelkarteFarbe = L.tileLayer('https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg');
    const swissimage = L.tileLayer('https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg');

    // Ajouter la couche par défaut
    swissimage.addTo(this.map!);

    // Contrôle des couches
    const baseMaps = {
      'Satelite': swissimage,
      'Carte nationale (couleur)': pixelkarteFarbe,
      'Carte nationale (gris)': pixelkarteGrau,
    };
    L.control.layers(baseMaps, {}, { position: 'topleft' }).addTo(this.map!);

    // Contrôle d'échelle
    L.control.scale({ imperial: false }).addTo(this.map!);

    // Trier les trails par id et créer la polyline avec les coordonnées lat/lon
    const sortedTrails = [...this.trails].sort((a, b) => a.id - b.id);
    const latlngs: L.LatLngExpression[] = sortedTrails.map(trail => [trail.lat, trail.lon] as L.LatLngExpression);
    
    console.log('First trail coordinates:', this.trails[0]);
    console.log('LatLngs array:', latlngs.slice(0, 3)); // Afficher les 3 premiers points
    
    if (latlngs.length > 0) {
      const polyline = L.polyline(latlngs, { 
        color: '#ff0000', 
        weight: 3, 
        opacity: 0.8 
      }).addTo(this.map!);

      // Adapter la vue à la polyline avec vérification
      const bounds = polyline.getBounds();
      console.log('Polyline bounds:', bounds);
      
      if (bounds.isValid()) {
        this.map!.fitBounds(bounds, { padding: [50, 50] });
      } else {
        // Fallback : centrer sur le premier point
        this.map!.setView([this.trails[0].lat, this.trails[0].lon], 13);
      }
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

