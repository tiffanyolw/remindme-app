import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryPage } from './inventory.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryPage
  },
  {
    path: 'add-product',
    loadChildren: () => import('./add-product/add-product.module').then( m => m.AddProductPageModule)
  },
  {
    path: 'edit-product/:id',
    loadChildren: () => import('./edit-product/edit-product.module').then( m => m.EditProductPageModule)
  },
  {
    path: 'filter',
    loadChildren: () => import('./filter/filter.module').then( m => m.FilterPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryPageRoutingModule {}
