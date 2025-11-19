import { DatePipe } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
//import { PokemonBorderDirective } from '../../pokemon-border.directive';
import { Pokemon } from '../../pokemon.model';
import { catchError, of } from 'rxjs';
// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PokemonService } from '../../pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  imports: [DatePipe, RouterLink, MatButtonModule, MatCardModule, MatGridListModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})

export class PokemonListComponent {
  readonly #pokemonService = inject(PokemonService); // Injection du service PokemonService
  
  // Conversion de l'Observable en Signal
  readonly pokemonList = toSignal(
    this.#pokemonService.getPokemonList().pipe( // Récupère la liste des Pokémons
      catchError(error => {
        console.error('Erreur lors du chargement des pokémons:', error);
        return of([]);
      })
    ),
    { initialValue: [] } // Affiche un tableau vide pendant le chargement
  );
  readonly searchTerm = signal(''); // Terme de recherche pour filtrer les Pokémons

  // Filtrage des Pokémons en fonction du terme de recherche
  readonly pokemonListFiltered = computed(() => {
    const searchTerm = this.searchTerm();
    const pokemonList = this.pokemonList();
    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  });

  // Indicateur de chargement
  readonly loading = computed(() => this.pokemonList().length === 0);

  // Détermine la taille du Pokémon pour le style
  size(pokemon: Pokemon){
    if (pokemon.life > 25) {
      return 'grand';
    } else if (pokemon.life > 15) {
      return 'moyen';
    } else {
      return 'petit';
    }
  }

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