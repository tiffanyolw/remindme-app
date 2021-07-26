import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsumptionPageRoutingModule } from './consumption-routing.module';

import { ConsumptionPage } from './consumption.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsumptionPageRoutingModule
  ],
  declarations: [ConsumptionPage]
})
export class ConsumptionPageModule {}
