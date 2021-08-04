import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Constants } from 'src/app/data/constants';
import { Category } from 'src/app/interfaces/category';
import { Location } from 'src/app/interfaces/location';
import { Product, Status } from 'src/app/interfaces/product';
import { Unit } from 'src/app/interfaces/unit';
import { DataLookupService } from 'src/app/services/data-lookup.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {
  product: Product;
  updateProductForm: FormGroup;
  maxYear: number; // for date inputs
  categories: Category[] = [];
  locations: Location[] = [];
  units: Unit[] = [];

  constructor(private _activatedRoute: ActivatedRoute, private _builder: FormBuilder,
    private _navCtrl: NavController, private _toastCtrl: ToastController, private _alertCtrl: AlertController,
    private _service: ProductService, private _dataLookupService: DataLookupService, private _notificationService: NotificationService) {

    this.maxYear = Constants.maxYear;

    // only call API if no categories
    if (this._dataLookupService.categories.length > 0) {
      this.categories = this._dataLookupService.categories;
    } else {
      this._dataLookupService.getCategories().subscribe((result) => {
        this.categories = result;
      }, () => {
        this.showToast("Error: Could not load categories");
      });
    }

    // only call API if no locations
    if (this._dataLookupService.locations.length > 0) {
      this.locations = this._dataLookupService.locations;
    } else {
      this._dataLookupService.getLocations().subscribe((result) => {
        this.locations = result;
      }, () => {
        this.showToast("Error: Could not load locations stored");
      });
    }

    // only call API if no units
    if (this._dataLookupService.units.length > 0) {
      this.units = this._dataLookupService.units;
    } else {
      this._dataLookupService.getUnits().subscribe((result) => {
        this.units = result;
      }, () => {
        this.showToast("Error: Could not load units");
      });
    }
  }

  private async showToast(message: string) {
    const toast = await this._toastCtrl.create({
      message,
      duration: 2000
    });

    toast.present();
  }

  private update(data: Product, status: Status, quantityConsumed: number, quantityTrashed: number) {
    let body = data;
    body.status = status;

    body.quantityConsumed = this.product.quantityConsumed + quantityConsumed;
    body.quantity = data.quantity - quantityConsumed;

    body.quantityTrashed = this.product.quantityTrashed + quantityTrashed;
    body.quantity = data.quantity - quantityTrashed;

    this._service.updateProduct(this.product.id, body).subscribe((result) => {
      // update notifications
      // clear all notifications for the product
      this._notificationService.clearNotifications(result.id);

      // only schedule notifications if not consumed nor trashed
      if (result.status !== Status.Ready) {
        // notification for day of expiry
        const expiryDate = result.expiryDate;
        if (expiryDate && result.onExpiryNotify) {
          let notifDate: Date = new Date(expiryDate);
          notifDate.setHours(0, 0, 0, 0);
          this._notificationService.scheduleOnExpiryNotification(notifDate, result);
        }

        // notification for days before expiry
        const daysBeforeNotify = result.daysBeforeNotify;
        if (expiryDate && daysBeforeNotify) {
          let notifDate: Date = new Date(expiryDate);
          notifDate.setHours(0, 0, 0, 0);
          notifDate.setDate(notifDate.getDate() - daysBeforeNotify);
          this._notificationService.scheduleBeforeExpiryNotification(notifDate, result);
        }

        // notification for days after expiry
        const daysAfterNotify = result.daysAfterNotify;
        if (expiryDate && daysAfterNotify) {
          let notifDate: Date = new Date(expiryDate);
          notifDate.setHours(0, 0, 0, 0);
          notifDate.setDate(notifDate.getDate() + daysAfterNotify);
          this._notificationService.scheduleAfterExpiryNotification(notifDate, result);
        }
      }

      this.showToast(`${result.name} successfully updated`);
      this._navCtrl.back();
    }, () => {
      this.showToast(`Error: Could not update ${this.product.name}`);
    });
  }

  onUpdate() {
    this.update(this.updateProductForm.value, this.product.status, 0, 0);
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
              // delete notifications
              this._notificationService.clearNotifications(result.id);

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

  async onConsume() {
    const alert = await this._alertCtrl.create({
      header: "Quantity Consumed",
      inputs: [{
        name: "quantity",
        type: "number",
        min: 0,
        max: this.product.quantity
      }],
      buttons: [
        { text: "Cancel" },
        {
          text: "Confirm",
          handler: (data) => {
            let quantity: number = parseFloat(data.quantity);
            if (quantity < 0) {
              return;
            } else if (quantity >= this.product.quantity) {
              this.update(this.product, Status.Consumed, quantity, 0);
            } else if (quantity < this.product.quantity) {
              this.update(this.product, this.product.status, quantity, 0);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async onTrash() {
    const alert = await this._alertCtrl.create({
      header: "Quantity Trashed",
      inputs: [{
        name: "quantity",
        type: "number",
        min: 0,
        max: this.product.quantity
      }],
      buttons: [
        { text: "Cancel" },
        {
          text: "Confirm",
          handler: (data) => {
            let quantity = parseFloat(data.quantity);
            if (quantity < 0) {
              return;
            } else if (quantity >= this.product.quantity) {
              this.update(this.product, Status.Trashed, 0, quantity);
            } else if (quantity < this.product.quantity) {
              this.update(this.product, this.product.status, 0, quantity);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this._activatedRoute.paramMap.subscribe((params) => {
      this._service.getProductById(parseInt(params.get("id"))).subscribe((result) => {
        this.product = result;

        this.updateProductForm = this._builder.group({
          name: [this.product.name, [Validators.required]],
          quantity: [this.product.quantity, [Validators.required]],
          unitId: [this.product.unitId, [Validators.required]],
          purchaseDate: [this.product.purchaseDate],
          expiryDate: [this.product.expiryDate],
          categoryId: [this.product.categoryId, [Validators.required]],
          locationStoredId: [this.product.locationStoredId, [Validators.required]],
          notes: [this.product.notes],
          onExpiryNotify: [this.product.onExpiryNotify, [Validators.required]],
          daysBeforeNotify: [this.product.daysBeforeNotify],
          daysAfterNotify: [this.product.daysAfterNotify]
        });
      }, () => {
        this.showToast(`Error: Could not load ${this.product.name} information`);
      });
    });
  }

  ngOnInit() {
  }

}
