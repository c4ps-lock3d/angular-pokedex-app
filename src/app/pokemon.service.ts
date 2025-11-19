import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon, PokemonList } from './pokemon.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root' // Le service est disponible dans toute l'application
})
export class PokemonService implements PokemonService {
  private readonly http = inject(HttpClient); // Injection du HttpClient
  private readonly POKEMON_API_URL = environment.apiUrl; // URL de l'API, selon l'environnement

  getPokemonList(): Observable<PokemonList> { // Observable : flux de données asynchrone avec retour de type PokemonList
    return this.http.get<PokemonList>(this.POKEMON_API_URL); // Récupère la liste des Pokémons
  }

  getPokemonById(id: number): Observable<Pokemon> { 
    return this.http.get<Pokemon>(`${this.POKEMON_API_URL}/${id}`); // Récupère un Pokémon par son ID
  }

  updatePokemon(pokemon: Pokemon): Observable<Pokemon> { 
    return this.http.put<Pokemon>(`${this.POKEMON_API_URL}/${pokemon.id}`, pokemon); // Met à jour un Pokémon
  }

  deletePokemon(pokemonId: number): Observable<void> {
    return this.http.delete<void>(`${this.POKEMON_API_URL}/${pokemonId}`); // Supprime un Pokémon
  }

  addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon> { 
    return this.http.post<Pokemon>(this.POKEMON_API_URL, pokemon); // Ajoute un nouveau Pokémon
  }

  getPokemonTypeList(): string[] { // Retourne la liste des types de Pokémon
    return [
      'Plante', 'Feu', 'Eau', 'Insecte', 'Normal',
      'Electrik', 'Poison', 'Fée', 'Vol'
    ];
  }
}