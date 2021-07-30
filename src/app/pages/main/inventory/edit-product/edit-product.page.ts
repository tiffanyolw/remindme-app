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
    private _service: ProductService, private _dataLookupService: DataLookupService) {

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

  private async showAlert(header: string, subHeader?: string, message?: string, buttons?: any[], inputs?: any[]) {
    const alert = await this._alertCtrl.create({
      header,
      subHeader,
      message,
      buttons,
      inputs
    });

    await alert.present();
  }

  update(status?: Status) {
    let form: Product = this.updateProductForm.value;
    form.status = status || this.product.status;

    this._service.updateProduct(this.product.id, form).subscribe((result) => {
      this.showToast(`${result.name} successfully updated`);
      this._navCtrl.back();
    }, () => {
      this.showToast(`Error: Could not update ${this.product.name}`);
    });
  }

  delete() {
    this.showAlert("Delete",
      "Are you sure you want to delete?",
      "This action cannot be undone.",
      [
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
    );
  }

  consume() {
    this.update(Status.Consumed);
  }

  trash() {
    this.update(Status.Trashed);
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
          daysBeforeNotify: [this.product.daysBeforeNotify]
        });
      }, () => {
        this.showToast(`Error: Could not load ${this.product.name} information`);
      });
    });
  }

  ngOnInit() {
  }

}
