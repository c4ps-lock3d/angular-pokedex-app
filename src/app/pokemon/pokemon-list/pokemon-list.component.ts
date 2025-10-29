import { DatePipe } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PokemonBorderDirective } from '../../pokemon-border.directive';
import { Pokemon } from '../../pokemon.model';
import { PokemonService } from '../../pokemon.service';
import { catchError, of } from 'rxjs';
// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pokemon-list',
  imports: [PokemonBorderDirective, DatePipe, RouterLink, MatButtonModule, MatCardModule, MatGridListModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './pokemon-list.component.html',
  styles: `.pokemon-card {
    margin: 8px;
    width: calc(100% - 16px);
    height: calc(100% - 16px);
    cursor: pointer;
  }`
})

export class PokemonListComponent {
  readonly #pokemonService = inject(PokemonService);
  
  // Conversion de l'Observable en Signal
  readonly pokemonList = toSignal(
    this.#pokemonService.getPokemonList().pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des pokémons:', error);
        return of([]);
      })
    ),
    { initialValue: [] }
  );  readonly searchTerm = signal('');

  readonly pokemonListFiltered = computed(() => {
    const searchTerm = this.searchTerm();
    const pokemonList = this.pokemonList();

    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  });

  // Indicateur de chargement
  readonly loading = computed(() => this.pokemonList().length === 0);

  size(pokemon: Pokemon){
    if (pokemon.life > 25) {
      return 'grand';
    } else if (pokemon.life > 15) {
      return 'moyen';
    } else {
      return 'petit';
    }
  }

  cols = signal(3);

  ngOnInit() {
    this.updateGridCols();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateGridCols();
  }

  updateGridCols() {
    const width = window.innerWidth;
    if (width < 600) {
      this.cols.set(1);
    } else if (width < 960) {
      this.cols.set(2);
    } else if (width < 1280) {
      this.cols.set(3);
    } else {
      this.cols.set(4);
    }
  }
}