import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-inventory-filter',
  templateUrl: './inventory-filter.component.html',
  styleUrls: ['./inventory-filter.component.scss'],
})
export class InventoryFilterComponent implements OnInit {
  categories: string[] = [];
  locations: string[] = [];

  constructor(private _modalCtrl: ModalController) { }

  selectAll(checked: boolean) {
    // to do
  }

  applyFilters() {
    // todo
    this._modalCtrl.dismiss();
  }

  ionViewWillEnter() {
    // TODO
  }

  ngOnInit() {}

}
