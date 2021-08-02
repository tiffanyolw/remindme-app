import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthguardService } from './services/account/authguard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full'
  },
  {
    path: 'inventory',
    loadChildren: () => import('./pages/main/inventory/inventory.module').then(m => m.InventoryPageModule),
    canActivate: [AuthguardService]
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/main/history/history.module').then(m => m.HistoryPageModule),
    canActivate: [AuthguardService]
  },
  {
    path: 'shopping-list',
    loadChildren: () => import('./pages/main/shopping-list/shopping-list.module').then(m => m.ShoppingListPageModule),
    canActivate: [AuthguardService]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/account/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/account/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'account/settings',
    loadChildren: () => import('./pages/account/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthguardService]
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
