import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Constants } from 'src/app/data/constants';
import { Order, Ordering } from 'src/app/interfaces/order';
import { Product, Status } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { FilterPage } from './../inventory/filter/filter.page';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  productsList: Product[];

  // filtered selections
  categories: number[] = [];
  locations: number[] = [];
  order: Order = {
    orderBy: "expiryDate",
    ordering: Ordering.ASC
  };

  constructor(private _modalCtrl: ModalController, private _toastCtrl: ToastController,
    private _service: ProductService) {
  }

  private async showToast(message: string) {
    const toast = await this._toastCtrl.create({
      message,
      duration: 2000
    });

    toast.present();
  }

  private loadAll() {
    this._service.getProducts([Status.Consumed, Status.Trashed], null, this.categories, this.locations, this.order)
      .subscribe((result) => {
        this.productsList = result;
      }, () => {
        this.showToast("Error: Could not load products");
      });
  }

  async presentFilter() {
    const modal = await this._modalCtrl.create({
      component: FilterPage,
      componentProps: {
        categories: this.categories,
        locations: this.locations,
        order: this.order
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.categories = data.categories;
      this.locations = data.locations;
      this.order = data.order;

      this.loadAll();

      // update storage
      const filterOptions: { categories: number[], locations: number[], order: Order } = {
        categories: this.categories,
        locations: this.locations,
        order: this.order
      };
      localStorage.setItem("historyFilterOptions", JSON.stringify(filterOptions));
    }
  }

  getUnit(product: Product, quantity: number) {
    if (product.unitId === Constants.NoUnitId) {
      return "";
    } else if (quantity === 1) {
      return product.unit.name;
    }
    return product.unit.pluralName || product.unit.name;
  }

  getConsumed(product: Product): string {
    let quantity = product.quantityConsumed;
    return `${quantity} ${this.getUnit(product, quantity)}`;
  }

  getTrashed(product: Product) {
    let quantity = product.quantityTrashed;
    return `${quantity} ${this.getUnit(product, quantity)}`;
  }

  ionViewWillEnter() {
    this.loadAll();

    // get from storage
    const filterOptions: { categories: number[], locations: number[], order: Order } =
      JSON.parse(localStorage.getItem("historyFilterOptions")!);
    this.categories = filterOptions?.categories || [];
    this.locations = filterOptions?.locations || [];
    this.order = filterOptions?.order || {
      orderBy: "expiryDate",
      ordering: Ordering.ASC
    };
  }

  ngOnInit() {
  }

}
