import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { authGuard } from '../auth/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../pages/1.APOD-tab/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../pages/2.NEO-tab/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../pages/3.EONET-tab/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: 'tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],          
    loadChildren: () => import('../pages-generales/pages-generales.module')
      .then(m => m.PagesGeneralesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}