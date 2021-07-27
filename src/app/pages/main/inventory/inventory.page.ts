import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InventoryFilterComponent } from 'src/app/components/inventory-filter/inventory-filter.component';
import { Product, Status } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  private productsList: Product[] = [];
  private expiredList: Product[] = [];
  private categories?: string = null;
  private locations?: string = null;
  private orderBy: string = "expiryDate";
  private ordering: string = "desc";
  listItems: Product[] = [];
  segment: string = "products";

  constructor(private _service: ProductService, private _modalCtrl: ModalController) { }

  private loadAll() {
    this._service.getProducts(Status.Ready, false).subscribe((result) => {
      this.productsList = result;
    }, (err) => {
      // TODO
    });

    this._service.getProducts(Status.Ready, true).subscribe((result) => {
      this.expiredList = result;
    }, (err) => {
      // TODO
    });
  }

  async presentFilter() {
    const modal = await this._modalCtrl.create({
      component: InventoryFilterComponent
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
