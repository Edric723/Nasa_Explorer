import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';

import { PagesGeneralesRoutingModule } from './pages-generales-routing.module';

import { AboutPage } from '../pages/4-Menu/integrantes/integrantes.page';
import { ReadmePage } from '../pages/4-Menu/acerca-de/acerca-de.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PagesGeneralesRoutingModule
  ],
  declarations: [
    AboutPage,
    ReadmePage
  ]
})
export class PagesGeneralesModule {}