import { IonicModule } from '@ionic/angular/lazy';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab3Page } from './eonet.page';

import { EonetPageRoutingModule } from './eonet-routing.module';
import { MenuGlobalModule } from '../../components/menu-global/menu-global.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    EonetPageRoutingModule,
    MenuGlobalModule
  ],
  declarations: [Tab3Page]
})
export class EonetPageModule {}
