import { IonicModule } from '@ionic/angular/lazy';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab1Page } from './apod.page';
import { MenuGlobalModule } from '../../components/menu-global/menu-global.module';


import { ApodPageRoutingModule } from './apod-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ApodPageRoutingModule,
    MenuGlobalModule
  ],
  declarations: [Tab1Page]
})
export class ApodPageModule {}
