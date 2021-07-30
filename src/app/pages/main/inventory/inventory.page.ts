import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Constants } from 'src/app/data/constants';
import { Order, Ordering } from 'src/app/interfaces/order';
import { Product, Status } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { FilterPage } from './filter/filter.page';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  private productsList: Product[] = [];
  private expiredList: Product[] = [];
  segment: string = "products";

  // filtered selections
  categories: number[] = [];
  locations: number[] = [];
  order: Order = {
    orderBy: "expiryDate",
    ordering: Ordering.DESC
  };

  constructor(private _modalCtrl: ModalController, private _toastCtrl: ToastController,
    private _service: ProductService) {
  }

  private loadAll() {
    this._service.getProducts(Status.Ready, false, this.categories, this.locations, this.order)
      .subscribe((result) => {
        this.productsList = result;
      }, () => {
        this.showToast("Error: Could not load products");
      });

    this._service.getProducts(Status.Ready, true, this.categories, this.locations, this.order)
      .subscribe((result) => {
        this.expiredList = result;
      }, () => {
        this.showToast("Error: Could not load products");
      });
  }

  private async showToast(message: string) {
    const toast = await this._toastCtrl.create({
      message,
      duration: 2000
    });

    toast.present();
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
    }
  }

  getList(): Product[] {
    if (this.segment === "products") {
      return this.productsList;
    } else if (this.segment === "expired") {
      return this.expiredList;
    }
    return [];
  }

  getUnitName(product: Product): string {
    if (product.unitId === Constants.NoUnitId) {
      return "";
    } else if (product.quantity === 1) {
      return product.unit.name;
    }
    return product.unit.pluralName || product.unit.name;
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  ngOnInit() {
  }

}
