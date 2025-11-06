import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { getPokemonColor, POKEMON_RULES } from '../../pokemon.model';
// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PokemonService } from '../../pokemon.service';


@Component({
  selector: 'app-pokemon-edit',
 imports: [
  RouterLink,
  ReactiveFormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatCheckboxModule,
  MatChipsModule,
  MatProgressSpinnerModule,
],
  // imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './pokemon-edit.component.html',
  styles: ``
})

export class PokemonEditComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly pokemonService = inject(PokemonService);
  readonly #pokemonId = Number(this.#route.snapshot.paramMap.get('id'));

  // 3 cas : requête en cours, requête OK, requête erreur
  readonly #pokemonResponse = toSignal(
    this.pokemonService.getPokemonById(this.#pokemonId).pipe(
      map((pokemon) => ({ value: pokemon, error: undefined})),
      catchError((error) => of({ value: undefined, error }))
    )
  );

  readonly loading = computed(() => this.#pokemonResponse() === undefined);
  readonly error = computed(() => this.#pokemonResponse()?.error !== undefined); // ? = shining operator -> si le chemin n'existe pas, retourne undefined
  readonly pokemon = computed(() => this.#pokemonResponse()?.value);
  readonly POKEMON_RULES = POKEMON_RULES;

  readonly form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(POKEMON_RULES.MIN_NAME),
      Validators.maxLength(POKEMON_RULES.MAX_NAME),
      Validators.pattern(POKEMON_RULES.NAME_PATTERN)
    ]),
    damage: new FormControl(),
    life: new FormControl(),
    types: new FormArray(
      [],
      [Validators.required, Validators.maxLength(POKEMON_RULES.MAX_TYPES),]
    ),
  });

  constructor() {
    effect(() => {
      const pokemon = this.pokemon();
      if (pokemon) {
        this.form.patchValue({
          name: pokemon.name,
          damage: pokemon.damage,
          life: pokemon.life,
        });

        pokemon.types.forEach((type) => {
          this.pokemonTypeList.push(new FormControl(type));
        });
      } 
    });
  }

  get pokemonTypeList(): FormArray {
    return this.form.get('types') as FormArray;
  }

  get pokemonName(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get pokemonLife(): FormControl {
    return this.form.get('life') as FormControl;
  }

  get pokemonDamage(): FormControl {
    return this.form.get('damage') as FormControl;
  }

  incrementLife() {
    const newValue = this.pokemonLife.value +1;
    this.pokemonLife.setValue(newValue);
  }

  decrementLife() {
    const newValue = this.pokemonLife.value -1;
    this.pokemonLife.setValue(newValue);
  }

  incrementDamage() {
    const newValue = this.pokemonDamage.value +1;
    this.pokemonDamage.setValue(newValue);
  }

  decrementDamage() {
    const newValue = this.pokemonDamage.value -1;
    this.pokemonDamage.setValue(newValue);
  }

  // méthode pour vérifier si un type est déjà sélectionné
  // le !! permet de convertir une valeur undefined en booléen
  isPokemonTypeSelected(type: string): boolean {
    return !!this.pokemonTypeList.controls.find(
      (control) => control.value === type
    );
  }

  // méthode pour gérer le changement de sélection d'un type
  onPokemonTypeChange(type: string, isChecked: boolean) {
      if (isChecked) {
        const control = new FormControl(type);
        this.pokemonTypeList.push(control);
      } else {
        const index = this.pokemonTypeList.controls.map((control) => control.value).indexOf(type);
        
        this.pokemonTypeList.removeAt(index);
      }

  }

  getPokemonColor(type: string) {
    return getPokemonColor(type);
  }

  getChipTextColor(type: string): 'black' | 'white' {
    return type === 'Electrik' ? 'black' : 'white';
  }

  onSubmit() {
    const isFormValid = this.form.valid;
    const pokemon = this.pokemon();
    
    if (isFormValid && pokemon) {
      const updatedPokemon = {
        ...pokemon, // fusionne les propriétés existantes du Pokémon
        name: this.pokemonName.value, // écrase la propriété 'name' avec la nouvelle valeur du formulaire
        life: this.pokemonLife.value,
        damage: this.pokemonDamage.value,
        types: this.pokemonTypeList.value,
      };
      this.pokemonService.updatePokemon(updatedPokemon).subscribe(() => {
        this.#router.navigate(['/pokemons', pokemon.id]);
      });
    }
  }
}