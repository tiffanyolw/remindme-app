import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsumptionPage } from './consumption.page';

const routes: Routes = [
  {
    path: '',
    component: ConsumptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumptionPageRoutingModule {}
