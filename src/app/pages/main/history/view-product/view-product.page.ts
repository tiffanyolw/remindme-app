import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Constants } from 'src/app/data/constants';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.page.html',
  styleUrls: ['./view-product.page.scss'],
})
export class ViewProductPage implements OnInit {
  product: Product;

  constructor(private _activatedRoute: ActivatedRoute, private _navCtrl: NavController,
    private _toastCtrl: ToastController, private _alertCtrl: AlertController,
    private _service: ProductService) { }

  private async showToast(message: string) {
    const toast = await this._toastCtrl.create({
      message,
      duration: 2000
    });

    toast.present();
  }

  async onDelete() {
    const alert = await this._alertCtrl.create({
      header: "Delete",
      subHeader: "Are you sure you want to delete?",
      message: "This action cannot be undone.",
      buttons: [
        { text: "Cancel" }, {
          text: "Delete",
          handler: () => {
            this._service.deleteProduct(this.product.id).subscribe((result) => {
              this.showToast(`${result.name} deleted successfully`);
              this._navCtrl.back();
            }, () => {
              this.showToast(`Error: Could not delete ${this.product.name}`);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  getUnitName(): string {
    if (this.product.unitId === Constants.NoUnitId) {
      return "";
    } else if (this.product.quantityConsumed == 1) {
      return this.product.unit.name;
    }
    return this.product.unit.pluralName || this.product.unit.name;
  }

  ionViewWillEnter() {
    this._activatedRoute.paramMap.subscribe((params) => {
      this._service.getProductById(parseInt(params.get("id"))).subscribe((result) => {
        this.product = result;
      }, () => {
        this.showToast(`Error: Could not load ${this.product.name} information`);
      });
    });
  }

  ngOnInit() {
  }

}
