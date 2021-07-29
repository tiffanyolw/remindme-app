import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { Location } from 'src/app/interfaces/location';
import { DataLookupService } from 'src/app/services/data-lookup.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {
  categories: Category[] = [];
  locations: Location[] = [];

  // filters and whether they were checked or not
  selectedCategories: any[] = [];
  selectedLocations: any[] = [];

  order: { orderBy: string, ordering: string };

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

    // only call API if no locations
    if (this._dataLookupService.locations.length > 0) {
      this.locations = this._dataLookupService.locations;
      this.getSelectedLocationData();
    } else {
      this._dataLookupService.getLocations().subscribe((result) => {
        this.locations = result;
        this.getSelectedLocationData();
      }, () => {
        this.showToast("Error: Could not load locations stored");
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

  private getSelectedLocationData() {
    const locationIds: number[] = this._navParams.get("locations");
    this.locations.forEach((location) => {
      this.selectedLocations.push({
        id: location.id,
        name: location.name,
        isChecked: locationIds.includes(location.id)
      });
    });
    // all checked if no filters set
    if (locationIds.length === 0) {
      this.toggleAllLocations(true);
    }
  }

  private async showToast(message: string) {
    const toast = await this._toastCtrl.create({
      message,
      duration: 2000
    });

    toast.present();
  }
  
  toggleOrdering() {
    if (this.order.ordering === "desc") {
      this.order.ordering = "asc";
    } else {
      this.order.ordering = "desc"
    }
  }

  toggleAllCategories(checked: boolean) {
    this.selectedCategories.forEach((category) => {
      category.isChecked = checked;
    });
  }

  toggleAllLocations(checked: boolean) {
    this.selectedLocations.forEach((location) => {
      location.isChecked = checked;
    });
  }

  reset() {
    this.toggleAllCategories(false);
    this.toggleAllLocations(false);
  }

  applyFilters() {
    let categoryIds: number[] = this.selectedCategories
      .filter(category => category.isChecked)
      .map(category => category.id);
    // no filters if all checked
    if (categoryIds.length === this.selectedCategories.length) {
      categoryIds = [];
    }
    let locationIds: number[] = this.selectedLocations
      .filter(location => location.isChecked)
      .map(location => location.id);
    // no filters if all checked
    if (locationIds.length === this.selectedLocations.length) {
      locationIds = [];
    }

    this.close({
      categories: categoryIds,
      locations: locationIds,
      order: this.order
    });
  }

  close(data?: any) {
    this._modalCtrl.dismiss(data);
  }

  ngOnInit() {
  }

}
