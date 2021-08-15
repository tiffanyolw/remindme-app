import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { Constants } from 'src/app/data/constants';
import { Category } from 'src/app/interfaces/category';
import { ShoppingItem } from 'src/app/interfaces/shoppingItem';
import { Unit } from 'src/app/interfaces/unit';
import { DataLookupService } from 'src/app/services/data-lookup.service';
import { ShoppingService } from 'src/app/services/shopping.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {
  addItemForm: FormGroup;
  categories: Category[] = [];
  units: Unit[] = [];

  constructor(private _builder: FormBuilder, private _navCtrl: NavController, private _toastCtrl: ToastController,
    private _shoppingService: ShoppingService, private _dataLookupService: DataLookupService) {
    this.addItemForm = this._builder.group({
      name: ["", [Validators.required]],
      quantity: [],
      unitId: [],
      categoryId: [Constants.NoCategoryId, [Validators.required]],
      price: [],
      storeName: [],
      notes: []
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

  onSubmit() {
    let form: ShoppingItem = this.addItemForm.value;
    form.bought = false;
    form.cleared = false;

    this._shoppingService.addItem(form).subscribe((result) => {
      this.showToast(`${result.name} added successfully`);
      this._navCtrl.back();
    }, () => {
      this.showToast(`Error: Could not add ${form.name}`);
    });
  }

  ngOnInit() {
  }

}
