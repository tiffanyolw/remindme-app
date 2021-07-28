import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Product, Status } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  maxYear: number;
  addProductForm: FormGroup;

  constructor(private _builder: FormBuilder, private _navCtrl: NavController, private _productService: ProductService) {
    this.maxYear = new Date(Date.now()).getFullYear() + 100;

    this.addProductForm = this._builder.group({
      name: ["", [Validators.required]],
      quantity: [1, [Validators.required]],
      unit: ["No Unit", [Validators.required]],
      purchaseDate: [],
      expiryDate: [],
      category: ["No Category", [Validators.required]],
      locationStored: ["No Location Stored", [Validators.required]],
      notes: [],
      daysBeforeNotify: []
    });
  }

  onSubmit() {
    let form: Product = this.addProductForm.value;
    form.status = Status.Ready;
    // to delete
    form.categoryId = 1;
    form.locationStoredId = 1;
    form.unitId = 1;
    // ----------

    this._productService.addProduct(form).subscribe(() => {
      // todo
      this._navCtrl.back();
    }, () => {
      // todo
    });
  }

  ngOnInit() {
  }

}
