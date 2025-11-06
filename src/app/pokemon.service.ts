import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon, PokemonList } from './pokemon.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService implements PokemonService {
  private readonly http = inject(HttpClient);
  private readonly POKEMON_API_URL = environment.apiUrl;

  getPokemonList(): Observable<PokemonList> {
    return this.http.get<PokemonList>(this.POKEMON_API_URL);
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.POKEMON_API_URL}/${id}`);
  }

  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    return this.http.put<Pokemon>(`${this.POKEMON_API_URL}/${pokemon.id}`, pokemon);
  }

  deletePokemon(pokemonId: number): Observable<void> {
    return this.http.delete<void>(`${this.POKEMON_API_URL}/${pokemonId}`);
  }

  addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon> {
    return this.http.post<Pokemon>(this.POKEMON_API_URL, pokemon);
  }

  getPokemonTypeList(): string[] {
    return [
      'Plante', 'Feu', 'Eau', 'Insecte', 'Normal',
      'Electrik', 'Poison', 'Fée', 'Vol'
    ];
  }
}