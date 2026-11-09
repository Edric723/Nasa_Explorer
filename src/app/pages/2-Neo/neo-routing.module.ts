import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NeoPage } from './neo.page';

const routes: Routes = [
  {
    path: '',
    component: NeoPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeoPageRoutingModule {}
