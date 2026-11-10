import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApodPage } from './apod.page';
import { FavoritosPage } from './favoritos/favoritos.page';

const routes: Routes = [
  {
    path: '',
    component: ApodPage,
  },
  { path: 'favoritos',
    component: FavoritosPage 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApodPageRoutingModule {}
