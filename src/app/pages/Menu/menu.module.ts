import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular/lazy';

import { MenuPageRoutingModule } from './menu-routing.module';
import { MenuGlobalModule } from '../../components/menu-global/menu-global.module';
import { IntegrantesPage } from './integrantes/integrantes.page';
import { AcercaDePage } from './acerca-de/acerca-de.page';

@NgModule({
  imports: [
    IonicModule,
    MenuPageRoutingModule,
    MenuGlobalModule
  ],
  declarations: [
    IntegrantesPage,
    AcercaDePage
  ]
})
export class MenuPageModule {}
