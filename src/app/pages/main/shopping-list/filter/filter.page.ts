import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { Order, Ordering } from 'src/app/interfaces/order';
import { DataLookupService } from 'src/app/services/data-lookup.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {
  categories: Category[] = [];

  // filters and whether they were checked or not
  selectedCategories: any[] = [];

  order: Order;

  constructor(private _modalCtrl: ModalController, private _toastCtrl: ToastController,
    private _navParams: NavParams, private _dataLookupService: DataLookupService) {

    this.order = this._navParams.get("order");

    // only call API if no categories
    if (this._dataLookupService.categories.length > 0) {
      this.categories = this._dataLookupService.categories;
      this.getSelectedCategoryData();
    } else {
      this._dataLookupService.getCategories().subscribe((result) => {
        this.categories = result;
        this.getSelectedCategoryData();
      }, () => {
        this.showToast("Error: Could not load categories");
      });
    }
  }

  private getSelectedCategoryData() {
    let categoryIds: number[] = this._navParams.get("categories");
    this.categories.forEach((category) => {
      this.selectedCategories.push({
        id: category.id,
        name: category.name,
        isChecked: categoryIds.includes(category.id)
      });
    });
    // all checked if no filters set
    if (categoryIds.length === 0) {
      this.toggleAllCategories(true);
    }
  }

  private async showToast(message: string) {
    const toast = await this._toastCtrl.create({
      message,
      duration: 2000
    });

    toast.present();
  }

  isDescending() {
    return this.order.ordering === Ordering.DESC;
  }
  
  toggleOrdering() {
    if (this.order.ordering === Ordering.DESC) {
      this.order.ordering = Ordering.ASC;
    } else {
      this.order.ordering = Ordering.DESC;
    }
  }

  toggleAllCategories(checked: boolean) {
    this.selectedCategories.forEach((category) => {
      category.isChecked = checked;
    });
  }

  reset() {
    this.toggleAllCategories(false);
  }

  applyFilters() {
    let categoryIds: number[] = this.selectedCategories
      .filter(category => category.isChecked)
      .map(category => category.id);
    // no filters if all checked
    if (categoryIds.length === this.selectedCategories.length) {
      categoryIds = [];
    }

    this.close({
      categories: categoryIds,
      order: this.order
    });
  }

  close(data?: any) {
    this._modalCtrl.dismiss(data);
  }

  ngOnInit() {
  }

}
