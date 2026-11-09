import { IonicModule } from '@ionic/angular/lazy';
import { NgModule } from '@angular/core';
import { ApodPage } from './apod.page';
import { MenuGlobalModule } from '../../components/menu-global/menu-global.module';


import { ApodPageRoutingModule } from './apod-routing.module';

@NgModule({
  imports: [
    IonicModule,
    ApodPageRoutingModule,
    MenuGlobalModule
  ],
  declarations: [ApodPage]
})
export class ApodPageModule {}
