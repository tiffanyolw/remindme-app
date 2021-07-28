import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { Location } from 'src/app/interfaces/location';
import { Product, Status } from 'src/app/interfaces/product';
import { Unit } from 'src/app/interfaces/unit';
import { DataLookupService } from 'src/app/services/data-lookup.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  addProductForm: FormGroup;
  maxYear: number;
  categories: Category[] = [];
  locations: Location[] = [];
  units: Unit[] = [];

  constructor(private _builder: FormBuilder, private _navCtrl: NavController, private _toastCtrl: ToastController,
    private _productService: ProductService, private _dataLookupService: DataLookupService) {

    this.maxYear = new Date(Date.now()).getFullYear() + 100;

    this.addProductForm = this._builder.group({
      name: ["", [Validators.required]],
      quantity: [1, [Validators.required]],
      unitId: [1, [Validators.required]],
      purchaseDate: [],
      expiryDate: [],
      categoryId: [1, [Validators.required]],
      locationStoredId: [1, [Validators.required]],
      notes: [],
      daysBeforeNotify: []
    });

    if (this._dataLookupService.categories.length > 0) {
      this.categories = this._dataLookupService.categories;
    } else {
      this._dataLookupService.getCategories().subscribe((result) => {
        this.categories = result;
      }, () => {
        this.showToast("Could not get categories");
      });
    }

    if (this._dataLookupService.locations.length > 0) {
      this.locations = this._dataLookupService.locations;
    } else {
      this._dataLookupService.getLocations().subscribe((result) => {
        this.locations = result;
      }, () => {
        this.showToast("Could not get locations stored");
      });
    }

    if (this._dataLookupService.units.length > 0) {
      this.units = this._dataLookupService.units;
    } else {
      this._dataLookupService.getUnits().subscribe((result) => {
        this.units = result;
      }, () => {
        this.showToast("Could not get units");
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

  onSubmit() {
    let form: Product = this.addProductForm.value;
    form.status = Status.Ready;

    this._productService.addProduct(form).subscribe(() => {
      this.showToast("Product added successfully");
      this._navCtrl.back();
    }, () => {
      this.showToast("Error: Could not add product");
    });
  }

  ngOnInit() {
  }

}
