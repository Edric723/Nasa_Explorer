import { IonicModule } from '@ionic/angular/lazy';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NeoPage } from './neo.page';

import { NeoPageRoutingModule } from './neo-routing.module';
import { SimuladorNeoComponent } from '../../components/simulador-neo/simulador-neo.component';
import { MenuGlobalModule } from '../../components/menu-global/menu-global.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    NeoPageRoutingModule,
    MenuGlobalModule
  ],
  declarations: [NeoPage, SimuladorNeoComponent]
})
export class NeoPageModule {}
