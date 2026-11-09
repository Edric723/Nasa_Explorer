import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { 
        path: '', 
        redirectTo: 'apod', 
        pathMatch: 'full' },
      {
        path: 'apod',
        loadChildren: () => import('../pages/1-Apod/apod.module')
          .then(m => m.ApodPageModule)
      },
      {
        path: 'neo',
        loadChildren: () => import('../pages/2-Neo/neo.module')
          .then(m => m.NeoPageModule)
      },
      {
        path: 'eonet',
        loadChildren: () => import('../pages/3-Eonet/eonet.module')
          .then(m => m.EonetPageModule)
      },
      {
        path: 'menu',
        loadChildren: () => import('../pages/Menu/menu.module')
          .then(m => m.MenuPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}