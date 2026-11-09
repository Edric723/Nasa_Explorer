import { IonicModule } from '@ionic/angular/lazy';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab2Page } from './neo.page';

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
  declarations: [Tab2Page, SimuladorNeoComponent]
})
export class NeoPageModule {}
