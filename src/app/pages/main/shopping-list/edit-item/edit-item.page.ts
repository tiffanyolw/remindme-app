import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { ShoppingItem } from 'src/app/interfaces/shoppingItem';
import { Unit } from 'src/app/interfaces/unit';
import { DataLookupService } from 'src/app/services/data-lookup.service';
import { ShoppingService } from 'src/app/services/shopping.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.page.html',
  styleUrls: ['./edit-item.page.scss'],
})
export class EditItemPage implements OnInit {
  item: ShoppingItem;
  updateItemForm: FormGroup;
  categories: Category[] = [];
  units: Unit[] = [];

  constructor(private _activatedRoute: ActivatedRoute, private _builder: FormBuilder,
    private _navCtrl: NavController, private _toastCtrl: ToastController, private _alertCtrl: AlertController,
    private _service: ShoppingService, private _dataLookupService: DataLookupService) {

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

  onUpdate() {
    let body = this.updateItemForm.value;
    body.cleared = this.item.cleared;
    body.bought = this.item.bought;

    this._service.updateItems(this.item.id, body).subscribe((result) => {
      this.showToast(`${result.name} successfully updated`);
      this._navCtrl.back();
    }, () => {
      this.showToast(`Error: Could not update ${this.item.name}`);
    });
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
            this._service.deleteItems(this.item.id).subscribe((result) => {
              this.showToast(`${result.name} deleted successfully`);
              this._navCtrl.back();
            }, () => {
              this.showToast(`Error: Could not delete ${this.item.name}`);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this._activatedRoute.paramMap.subscribe((params) => {
      this._service.getItemById(parseInt(params.get("id"))).subscribe((result) => {
        this.item = result;

        this.updateItemForm = this._builder.group({
          name: [this.item.name, [Validators.required]],
          quantity: [this.item.quantity],
          unitId: [this.item.unitId],
          categoryId: [this.item.categoryId, [Validators.required]],
          price: [this.item.price],
          storeName: [this.item.storeName],
          notes: [this.item.notes]
        });
      }, () => {
        this.showToast(`Error: Could not load ${this.item.name} information`);
      });
    });
  }

  ngOnInit() {
  }

}
