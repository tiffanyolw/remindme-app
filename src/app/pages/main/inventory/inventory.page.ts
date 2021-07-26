import { Component, OnInit } from '@angular/core';
import { Product, Status } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  segment: string = "products";
  productsList: Product[] = [];
  expiredList: Product[] = [];

  constructor(private _service: ProductService) { }

  private loadProducts() {
    this._service.getProducts("ready").subscribe((result) => {
      this.productsList = result;
    }, () => {
      // show message
    });
  }

  private loadExpired() {
    this._service.getProducts("expired").subscribe((result) => {
      this.expiredList = result;
    }, () => {
      // show message
    });
  }

  private updateExpired() {
    let now = new Date(Date.now());
    this.productsList.forEach((product) => {
      if (product.expiryDate < now) {
        product.status = Status.Expired;
      }
    });
    this.expiredList.forEach((product) => {
      if (product.expiryDate < now) {
        product.status = Status.Ready;
      }
    });
  }

  private loadAll() {
    this.loadExpired();
    this.loadProducts();
  }

  ionViewWillEnter() {
    this.loadAll();
    this.updateExpired();
    this.loadAll();
  }

  ngOnInit() {
  }

}
