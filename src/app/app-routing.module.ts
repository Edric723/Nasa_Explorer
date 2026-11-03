import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth-guard';
import { LoginGuard } from './auth/login.guard';


const routes: Routes = [
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadChildren: () => import('./pages/0.LOGIN/login.module')
      .then(m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    loadChildren: () => import('./tabs/tabs.module')
      .then(m => m.TabsPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./pages-generales/pages-generales.module')
      .then(m => m.PagesGeneralesModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
