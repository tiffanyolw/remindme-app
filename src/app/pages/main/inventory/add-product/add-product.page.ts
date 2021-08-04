import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { Location } from 'src/app/interfaces/location';
import { Product, Status } from 'src/app/interfaces/product';
import { Unit } from 'src/app/interfaces/unit';
import { DataLookupService } from 'src/app/services/data-lookup.service';
import { ProductService } from 'src/app/services/product.service';
import { Constants } from 'src/app/data/constants';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  addProductForm: FormGroup;
  maxYear: number = Constants.maxYear; // for date inputs
  categories: Category[] = [];
  locations: Location[] = [];
  units: Unit[] = [];

  constructor(private _builder: FormBuilder, private _navCtrl: NavController,
    private _toastCtrl: ToastController, private _localNotifications: LocalNotifications,
    private _productService: ProductService, private _dataLookupService: DataLookupService) {

    this.addProductForm = this._builder.group({
      name: ["", [Validators.required]],
      quantity: [1, [Validators.required]],
      unitId: [Constants.NoUnitId, [Validators.required]],
      purchaseDate: [],
      expiryDate: [],
      categoryId: [Constants.NoCategoryId, [Validators.required]],
      locationStoredId: [Constants.NoLocationId, [Validators.required]],
      notes: [],
      daysBeforeNotify: []
    });

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

  private scheduleNotification(date: Date, product: Product) {
    this._localNotifications.schedule({
      id: new Date().getTime(), // unique id for each notification
      title: `${product.name} is expiring in ${product.daysBeforeNotify} days`,
      text: `${product.name} is about to expire. Please try to consume it before it expires to reduce waste.`,
      trigger: { at: date },
      led: "FF0000",
      sound: null
    });
  }

  onSubmit() {
    let form: Product = this.addProductForm.value;
    form.status = Status.Ready;
    form.quantityConsumed = 0;
    form.quantityTrashed = 0;

    this._productService.addProduct(form).subscribe((result) => {
      // schedule notification
      let expiryDate = result.expiryDate;
      let daysBeforeNotify = result.daysBeforeNotify;
      if (expiryDate && daysBeforeNotify) {
        let notifDate: Date = new Date(expiryDate);
        notifDate.setHours(0, 0, 0, 0);
        notifDate.setDate(notifDate.getDate() - daysBeforeNotify);
        this.scheduleNotification(notifDate, result);
      }
      
      this.showToast(`${result.name} added successfully`);
      this._navCtrl.back();
    }, () => {
      this.showToast(`Error: Could not add ${form.name}`);
    });
  }

  ngOnInit() {
  }

}
