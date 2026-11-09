import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular/lazy';

import { MenuGlobalComponent } from './menu-global.component';

@NgModule({
  declarations: [
    MenuGlobalComponent
  ],
  imports: [
    RouterModule,
    IonicModule
  ],
  exports: [
    MenuGlobalComponent
  ]
})
export class MenuGlobalModule {}