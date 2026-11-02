import { IonicModule } from '@ionic/angular/lazy';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { SimuladorNeoComponent } from '../../components/simulador-neo/simulador-neo.component';
import { MenuGlobalModule } from '../../components/menu-global/menu-global.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    MenuGlobalModule
  ],
  declarations: [Tab2Page, SimuladorNeoComponent]
})
export class Tab2PageModule {}
