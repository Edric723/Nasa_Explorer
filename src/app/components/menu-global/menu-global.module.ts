import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular/lazy';

import { MenuGlobalComponent } from './menu-global.component';

@NgModule({
  declarations: [
    MenuGlobalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ],
  exports: [
    MenuGlobalComponent
  ]
})
export class MenuGlobalModule {}