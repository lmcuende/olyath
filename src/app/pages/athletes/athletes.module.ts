import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AthletesPageRoutingModule } from './athletes-routing.module';

import { AthletesPage } from './athletes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AthletesPageRoutingModule
  ],
  declarations: [AthletesPage]
})
export class AthletesPageModule {}
