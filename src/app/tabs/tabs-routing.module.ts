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
        redirectTo: 'tab1', 
        pathMatch: 'full' },
      {
        path: 'tab1',
        loadChildren: () => import('../pages/1-Apod/apod.module')
          .then(m => m.ApodPageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../pages/2-Neo/neo.module')
          .then(m => m.NeoPageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../pages/3-Eonet/eonet.module')
          .then(m => m.EonetPageModule)
      },
      {
        path: '',
        loadChildren: () => import('../pages-generales/pages-generales.module')
          .then(m => m.PagesGeneralesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}