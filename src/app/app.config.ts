import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { PokemonProfileComponent } from './pokemon/pokemon-profile/pokemon-profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PokemonEditComponent } from './pokemon/pokemon-edit/pokemon-edit.component';
import { provideHttpClient } from '@angular/common/http';
import { AuthGuard } from './core/auth/auth.gard';
import { LoginComponent } from './login/login.component';
import { PokemonAddComponent } from './pokemon/pokemon-add/pokemon-add.component';
import { PokemonService } from './pokemon.service';
import { environment } from '../environments/environment';
import { PokemonMongoDBService } from './pokemon-mongodb.service';

export function pokemonServiceFactory(): PokemonService {
  return environment.production
    ? new PokemonMongoDBService()
    : new PokemonMongoDBService();
}

const routes: Routes = [
  { path: 'login', component: LoginComponent, title: "Connexion" },
    { path: 'pokemons/add', component: PokemonAddComponent, title: "Ajout d'un Pokémon", },
    { path: 'pokemons/edit/:id', component: PokemonEditComponent, title: "Edition d'un Pokémon" },
    { path: 'pokemons/:id', component: PokemonProfileComponent, title: 'Profil du Pokémon' },
    { path: 'pokemons', component: PokemonListComponent, title: 'Liste des Pokémons' },
  // { path: 'pokemons', canActivateChild: [AuthGuard], children: [
  //   { path: 'add', component: PokemonAddComponent, title: "Ajout d'un Pokémon", },
  //   { path: 'edit/:id', component: PokemonEditComponent, title: "Edition d'un Pokémon" },
  //   { path: ':id', component: PokemonProfileComponent, title: 'Profil du Pokémon' },
  //   { path: '', component: PokemonListComponent, title: 'Liste des Pokémons' },
  //   ]
  // },
  { path: '', redirectTo: '/pokemons', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent},
]

export const appConfig: ApplicationConfig = {
    providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: PokemonService,
      useFactory: pokemonServiceFactory,
    },
  ]
};