import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { RandoListComponent } from './pokemon/rando-list/rando-list.component';
import { PokemonProfileComponent } from './pokemon/pokemon-profile/pokemon-profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PokemonEditComponent } from './pokemon/pokemon-edit/pokemon-edit.component';
import { provideHttpClient } from '@angular/common/http';
import { AuthGuard } from './core/auth/auth.gard';
import { LoginComponent } from './login/login.component';
import { PokemonAddComponent } from './pokemon/pokemon-add/pokemon-add.component';
import { PokemonService } from './pokemon.service';
import { RandoService } from './rando.service';

const routes: Routes = [
  //{ path: 'login', component: LoginComponent, title: "Connexion" },
    //{ path: 'pokemons/add', component: PokemonAddComponent, title: "Ajout d'un Pokémon", },
    //{ path: 'pokemons/edit/:id', component: PokemonEditComponent, title: "Edition d'un Pokémon" },
    //{ path: 'pokemons/:id', component: PokemonProfileComponent, title: 'Profil du Pokémon' },
    //{ path: 'pokemons', component: PokemonListComponent, title: 'Liste des Pokémons' },
    { path: 'randos', component: RandoListComponent, title: 'Liste des Randos' },
  // { path: 'pokemons', canActivateChild: [AuthGuard], children: [
  //   { path: 'add', component: PokemonAddComponent, title: "Ajout d'un Pokémon", },
  //   { path: 'edit/:id', component: PokemonEditComponent, title: "Edition d'un Pokémon" },
  //   { path: ':id', component: PokemonProfileComponent, title: 'Profil du Pokémon' },
  //   { path: '', component: PokemonListComponent, title: 'Liste des Pokémons' },
  //   ]
  // },
  { path: '', redirectTo: '/randos', pathMatch: 'full' }, // route par défaut
  { path: '**', component: PageNotFoundComponent}, // intercepte toutes les routes non définies
]

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Améliore les performances en regroupant les changements de détection
    provideRouter(routes), // Ajout du routeur aux providers de l'application
    provideHttpClient(), // Ajout du HttpClient aux providers de l'application
  ]
};