import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IntegrantesPage } from './integrantes/integrantes.page';
import { AcercaDePage } from './acerca-de/acerca-de.page';

const routes: Routes = [
  { path: 'integrantes', component: IntegrantesPage },
  { path: 'acerca-de', component: AcercaDePage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuPageRoutingModule {}