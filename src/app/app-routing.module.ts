import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full'
  },
  {
    path: 'inventory',
    loadChildren: () => import('./pages/main/inventory/inventory.module').then( m => m.InventoryPageModule)
  },
  {
    path: 'consumption',
    loadChildren: () => import('./pages/main/consumption/consumption.module').then( m => m.ConsumptionPageModule)
  },
  {
    path: 'groceries',
    loadChildren: () => import('./pages/main/groceries/groceries.module').then( m => m.GroceriesPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
