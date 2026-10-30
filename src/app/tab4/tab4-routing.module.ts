import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab4Page } from './tab4.page';
import { DocumentPage } from './document.page';
import { GlobePage } from './globe.page';
import { AboutPage } from './about.page';

const routes: Routes = [
  {
    path: 'document',
    component: DocumentPage
  },
  {
    path: 'globe',
    component: GlobePage
  },
  {
    path: 'about',
    component: AboutPage
  },
  {
    path: '',
    component: Tab4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab4PageRoutingModule {}
