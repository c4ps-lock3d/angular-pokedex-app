import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rando, RandoList } from './rando.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root' // Le service est disponible dans toute l'application
})
export class RandoService implements RandoService {
  private readonly http = inject(HttpClient); // Injection du HttpClient
  private readonly RANDO_API_URL = environment.apiUrl; // URL de l'API, selon l'environnement

  getRandoList(): Observable<RandoList> { // Observable : flux de données asynchrone avec retour de type RandoList
    return this.http.get<RandoList>(this.RANDO_API_URL); // Récupère la liste des Randos
  }

  getRandoById(id: number): Observable<Rando> { 
    return this.http.get<Rando>(`${this.RANDO_API_URL}/${id}`); // Récupère une Rando par son ID
  }

//   updatePokemon(pokemon: Pokemon): Observable<Pokemon> { 
//     return this.http.put<Pokemon>(`${this.POKEMON_API_URL}/${pokemon.id}`, pokemon); // Met à jour un Pokémon
//   }

   deleteRando(randoId: number): Observable<void> {
     return this.http.delete<void>(`${this.RANDO_API_URL}/${randoId}`); // Supprime une Rando
   }

//   addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon> { 
//     return this.http.post<Pokemon>(this.POKEMON_API_URL, pokemon); // Ajoute un nouveau Pokémon
//   }


}