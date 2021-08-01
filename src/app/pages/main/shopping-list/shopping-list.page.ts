import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Constants } from 'src/app/data/constants';
import { Order, Ordering } from 'src/app/interfaces/order';
import { ShoppingItem } from 'src/app/interfaces/shoppingItem';
import { ShoppingService } from 'src/app/services/shopping.service';
import { FilterPage } from './filter/filter.page';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {
  shoppingList: ShoppingItem[] = [];
  clearedItems: ShoppingItem[] = [];
  segment: string = "tobuy";
  isEditMode: boolean = false;

  // filtered selections
  categories: number[] = [];
  stores: string[] = [];
  isBought: boolean = null;
  order: Order = {
    orderBy: "createdAt",
    ordering: Ordering.DESC
  }

  constructor(private _toastCtrl: ToastController, private _alertCtrl: AlertController,
    private _modalCtrl: ModalController, private _navCtrl: NavController,
    private _service: ShoppingService) { }

  private async showToast(message: string) {
    const toast = await this._toastCtrl.create({
      message,
      duration: 2000
    });

    toast.present();
  }

  private loadAll() {
    this._service.getItems(this.isBought, false, this.categories, this.stores, this.order)
      .subscribe((result) => {
        this.shoppingList = result;
      }, () => {
        this.showToast("Error: Could not load items");
      });

    this._service.getItems(this.isBought, true, this.categories, this.stores, this.order)
      .subscribe((result) => {
        this.clearedItems = result;
      }, () => {
        this.showToast("Error: Could not load items");
      });
  }

  toggleStatus(item: ShoppingItem) {
    this._service.updateItems(item.id, item).subscribe(() => { },
      () => {
        this.showToast(`Error: Could not update ${item.name}`);
      });
  }

  async presentFilter() {
    const modal = await this._modalCtrl.create({
      component: FilterPage,
      componentProps: {
        categories: this.categories,
        order: this.order
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.categories = data.categories;
      this.order = data.order;

      this.loadAll();

      // update storage
      const filterOptions: { categories: number[], order: Order } = {
        categories: this.categories,
        order: this.order
      };
      localStorage.setItem("shoppingListFilterOptions", JSON.stringify(filterOptions));
    }
  }

  getList(): ShoppingItem[] {
    if (this.segment === "tobuy") {
      return this.shoppingList;
    } else if (this.segment === "archive") {
      return this.clearedItems;
    }
    return [];
  }

  getUnitName(item: ShoppingItem): string {
    if (item.unitId === Constants.NoUnitId) {
      return "";
    } else if (item.quantity == 1) {
      return item.itemUnit.name;
    }
    return item.itemUnit.pluralName || item.itemUnit.name;
  }

  async clearList() {
    const alert = await this._alertCtrl.create({
      header: "Clear",
      subHeader: "Are you sure you want to clear the list?",
      buttons: [
        { text: "Cancel" }, {
          text: "Clear",
          handler: () => {
            let isUpdated = true;
            this.shoppingList.forEach((item) => {
              item.cleared = true;
              this._service.updateItems(item.id, item)
                .subscribe(() => {
                  this.loadAll();
                }, () => {
                  isUpdated = false;
                });
            });

            if (!isUpdated) {
              this.showToast("Error: Could not update all items");
            }
          }
        }
      ]
    });

    await alert.present();
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  onClick(item: ShoppingItem) {
    console.log(true);
    if (this.isEditMode || this.segment === 'archive') {
      console.log(false);
      this._navCtrl.navigateForward(`/shopping-list/edit-item/${item.id}`);
    }
  }

  ionViewWillEnter() {
    this.loadAll();

    // get from storage
    const filterOptions: { categories: number[], order: Order } =
      JSON.parse(localStorage.getItem("shoppingListFilterOptions")!);
    this.categories = filterOptions?.categories || [];
    this.order = {
      orderBy: "createdAt",
      ordering: Ordering.DESC
    }
  }

  ngOnInit() {
  }

}
