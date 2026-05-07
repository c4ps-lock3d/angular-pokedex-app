import { DatePipe } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Rando } from '../../rando.model';
import { catchError, of } from 'rxjs';
// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RandoService } from '../../rando.service';

@Component({
  selector: 'app-rando-list',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatGridListModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './rando-list.component.html',
  styleUrls: ['./rando-list.component.css']
})

export class RandoListComponent {
  readonly #randoService = inject(RandoService); // Injection du service RandoService
  
  // Conversion de l'Observable en Signal
  readonly randoList = toSignal(
    this.#randoService.getRandoList().pipe( // Récupère la liste des Randos
      catchError(error => {
        console.error('Erreur lors du chargement des randos:', error);
        return of([]);
      })
    ),
    { initialValue: [] } // Affiche un tableau vide pendant le chargement
  );
  readonly searchTerm = signal(''); // Terme de recherche pour filtrer les Randos

  // Filtrage des Randos en fonction du terme de recherche
  readonly randoListFiltered = computed(() => {
    const searchTerm = this.searchTerm();
    const randoList = this.randoList();
    return randoList.filter((rando) =>
      rando.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  });

  // Indicateur de chargement
  readonly loading = computed(() => this.randoList().length === 0);

  // Redimensionnement réactif de la grille
  cols = signal(3); // Nombre de colonnes dans la grille (par défaut 3)
  ngOnInit() { // Initialisation du composant
    this.updateGridCols();
  }
  @HostListener('window:resize') // Écoute les événements de redimensionnement de la fenêtre
  onResize() {
    this.updateGridCols();
  }
  updateGridCols() {
    const width = window.innerWidth;
    if (width < 600) {
      this.cols.set(1); // Si la largeur est inférieure à 600px, une seule colonne
    } else if (width < 960) {
      this.cols.set(2); // Si la largeur est inférieure à 960px, deux colonnes
    } else if (width < 1280) {
      this.cols.set(3); // Si la largeur est inférieure à 1280px, trois colonnes
    } else {
      this.cols.set(4); // Sinon, quatre colonnes
    }
  }
}