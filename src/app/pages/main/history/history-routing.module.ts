import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryPage } from './history.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryPage
  },
  {
    path: 'view-product/:id',
    loadChildren: () => import('./view-product/view-product.module').then( m => m.ViewProductPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryPageRoutingModule {}
