import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'athletes', loadChildren: './pages/athletes/athletes.module#AthletesPageModule' },
  { path: 'athletes/:id', loadChildren: './pages/athlete/athlete.module#AthletePageModule' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'athletes',
    loadChildren: () => import('./pages/athletes/athletes.module').then( m => m.AthletesPageModule)
  },
  {
    path: 'athlete',
    loadChildren: () => import('./pages/athlete/athlete.module').then( m => m.AthletePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
