import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { authGuard } from './auth/auth-guard';
import { loginGuard } from './auth/login.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    loadChildren: () => import('./pages/0.LOGIN/login.module')
      .then(m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    canActivateChild: [authGuard],      
    loadChildren: () => import('./tabs/tabs.module')
      .then(m => m.TabsPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  

  {
    path: '**',
    redirectTo: 'login'
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
