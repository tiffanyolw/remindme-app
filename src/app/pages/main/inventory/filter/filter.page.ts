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
  selectedCategories: any[] = [];
  selectedLocations: any[] = [];

  constructor(private _modalCtrl: ModalController, private _toastCtrl: ToastController,
    private _navParams: NavParams, private _dataLookupService: DataLookupService) {
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
    const categoryIds: number[] = this._navParams.get("categories");
    this.categories.forEach((category) => {
      this.selectedCategories.push({
        id: category.id,
        name: category.name,
        isChecked: categoryIds.includes(category.id)
      });
    });
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
  }

  private async showToast(message: string) {
    const toast = await this._toastCtrl.create({
      message,
      duration: 2000
    });

    toast.present();
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
    const categoryIds: number[] = this.selectedCategories
      .filter(category => category.isChecked)
      .map(category => category.id);
    const locationIds: number[] = this.selectedLocations
      .filter(location => location.isChecked)
      .map(location => location.id);
    this.close({
      categories: categoryIds,
      locations: locationIds
    });
  }

  close(data?: any) {
    this._modalCtrl.dismiss(data);
  }

  ngOnInit() {
  }

}
