import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { RandoListComponent } from './rando/rando-list/rando-list.component';
import { RandoProfileComponent } from './rando/rando-profile/rando-profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PokemonEditComponent } from './rando/pokemon-edit/pokemon-edit.component';
import { provideHttpClient } from '@angular/common/http';
import { AuthGuard } from './core/auth/auth.gard';
import { LoginComponent } from './login/login.component';
import { PokemonAddComponent } from './rando/pokemon-add/pokemon-add.component';

const routes: Routes = [
  //{ path: 'login', component: LoginComponent, title: "Connexion" },
    //{ path: 'randos/add', component: RandoAddComponent, title: "Ajout d'une Rando", },
    //{ path: 'randos/edit/:id', component: RandoEditComponent, title: "Edition d'une Rando" },
    { path: 'randos/:id', component: RandoProfileComponent, title: 'Profil de la Rando' },
    { path: 'randos', component: RandoListComponent, title: 'Liste des Randos' },
  // { path: 'randos', canActivateChild: [AuthGuard], children: [
  //   { path: 'add', component: RandoAddComponent, title: "Ajout d'une Rando", },
  //   { path: 'edit/:id', component: RandoEditComponent, title: "Edition d'une Rando" },
     { path: ':id', component: RandoProfileComponent, title: 'Profil de la Rando' },
     { path: '', component: RandoListComponent, title: 'Liste des Randos  ' },
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
    //PokemonService, // Ajout du service PokemonService aux providers de l'application
    //RandoService // Ajout du service RandoService aux providers de l'application
  ]
};