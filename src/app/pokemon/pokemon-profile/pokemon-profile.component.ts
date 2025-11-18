import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { PokemonService } from '../../pokemon.service';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-pokemon-profile',
  imports: [RouterLink, DatePipe, MatButtonModule, MatCardModule, MatGridListModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatIconModule, MatChipsModule, MatDialogModule],
  templateUrl: './pokemon-profile.component.html',
  styleUrls: ['./pokemon-profile.component.css']
})

export class PokemonProfileComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #pokemonService = inject(PokemonService);
  readonly #pokemonId = Number(this.#route.snapshot.paramMap.get('id'));

  // 3 cas : requête en cours, requête OK, requête erreur
  readonly #pokemonResponse = toSignal(
    this.#pokemonService.getPokemonById(this.#pokemonId).pipe(
      map((pokemon) => ({ value: pokemon, error: undefined})),
      catchError((error) => of({ value: undefined, error }))
    )
  );

  readonly loading = computed(() => this.#pokemonResponse() === undefined);
  readonly error = computed(() => this.#pokemonResponse()?.error !== undefined); // ? = shining operator -> si le chemin n'existe pas, retourne undefined
  readonly pokemon = computed(() => this.#pokemonResponse()?.value);
  readonly #dialog = inject(MatDialog);
  
  deletePokemon() {
    this.#pokemonService.deletePokemon(this.#pokemonId).subscribe(() => {
      this.#router.navigate(['/pokemons']);
    });
  }

  openDeleteDialog() {
    const dialogRef = this.#dialog.open(ConfirmDialogComponent, {
      height: 'auto',
      width: 'auto',
      data: {
        title: 'Supprimer le Pokémon',
        message: 'Êtes‑vous sûr de vouloir supprimer ce Pokémon ?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deletePokemon();
      }
    });
  }
}