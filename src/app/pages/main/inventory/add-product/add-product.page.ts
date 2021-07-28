import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { Location } from 'src/app/interfaces/location';
import { Product, Status } from 'src/app/interfaces/product';
import { Unit } from 'src/app/interfaces/unit';
import { CategoryService } from 'src/app/services/category.service';
import { LocationService } from 'src/app/services/location.service';
import { ProductService } from 'src/app/services/product.service';
import { UnitService } from 'src/app/services/unit.service';

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

  constructor(private _builder: FormBuilder, private _navCtrl: NavController,
    private _productService: ProductService, private _categoryService: CategoryService,
    private _locationService: LocationService, private _unitService: UnitService) {

    this.maxYear = new Date(Date.now()).getFullYear() + 100;

    this.addProductForm = this._builder.group({
      name: ["", [Validators.required]],
      quantity: [1, [Validators.required]],
      unitId: ["No Unit", [Validators.required]],
      purchaseDate: [],
      expiryDate: [],
      categoryId: [1, [Validators.required]],
      locationStoredId: ["No Location Stored", [Validators.required]],
      notes: [],
      daysBeforeNotify: []
    });

    this._categoryService.getCategories().subscribe((result) => {
      this.categories = result;
    }, (err) => {
      // todo
    });

    this._locationService.getLocations().subscribe((result) => {
      this.locations = result;
    }, (err) => {
      // todo
    });

    this._unitService.getUnits().subscribe((result) => {
      this.units = result;
    }, (err) => {
      // todo
    });
  }

  onSubmit() {
    let form: Product = this.addProductForm.value;
    form.status = Status.Ready;

    this._productService.addProduct(form).subscribe(() => {
      this._navCtrl.back();
    }, (err) => {
      // todo
    });
  }

  ngOnInit() {
  }

}
