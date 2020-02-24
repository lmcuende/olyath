import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AthletesPage } from './athletes.page';

const routes: Routes = [
  {
    path: '',
    component: AthletesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AthletesPageRoutingModule {}
