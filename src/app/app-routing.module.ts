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
    loadChildren: () => import('./pages/main/inventory/inventory.module').then(m => m.InventoryPageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/main/history/history.module').then(m => m.HistoryPageModule)
  },
  {
    path: 'shopping-list',
    loadChildren: () => import('./pages/main/shopping-list/shopping-list.module').then(m => m.ShoppingListPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
