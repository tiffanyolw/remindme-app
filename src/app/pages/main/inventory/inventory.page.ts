import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  listItems: Product[] = [];
  categories?: string[] = null;
  locations?: string[] = null;
  orderBy: string = "id";
  ordering: string = "desc";
  segment: string = "products";

  constructor(private _service: ProductService, private _modalCtrl: ModalController) { }

  private loadAll() {
    this._service.getProducts(Status.Ready, false, this.categories, this.locations, this.orderBy, this.ordering).subscribe((result) => {
      this.productsList = result;
    }, (err) => {
      // TODO
    });

    this._service.getProducts(Status.Ready, true, this.categories, this.locations, this.orderBy, this.ordering).subscribe((result) => {
      this.expiredList = result;
    }, (err) => {
      // TODO
    });
  }

  async presentFilter() {
    const modal = await this._modalCtrl.create({
      component: FilterPage
    });

    await modal.present();
    await modal.onWillDismiss();
  }

  getList(): Product[] {
    if (this.segment === "products") {
      return this.productsList;
    } else if (this.segment === "expired") {
      return this.expiredList;
    }
    return [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  ngOnInit() {
  }

}
