import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutPage } from '../pages/4-Menu/integrantes/integrantes.page';
import { ReadmePage } from '../pages/4-Menu/acerca-de/acerca-de.page';

const routes: Routes = [
  { path: 'about', component: AboutPage },
  { path: 'readme', component: ReadmePage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesGeneralesRoutingModule {}