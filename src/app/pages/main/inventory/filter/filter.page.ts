import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  constructor(private _modalCtrl: ModalController, private _dataLookupService: DataLookupService) {
    if (this._dataLookupService.categories.length > 0) {
      this.categories = this._dataLookupService.categories;
    } else {
      this._dataLookupService.getCategories().subscribe((result) => {
        this.categories = result;
      }, () => {
        // this.showToast("Could not get categories");
      });
    }

    if (this._dataLookupService.locations.length > 0) {
      this.locations = this._dataLookupService.locations;
    } else {
      this._dataLookupService.getLocations().subscribe((result) => {
        this.locations = result;
      }, () => {
        //this.showToast("Could not get locations stored");
      });
    }
  }

  selectAll(checked: boolean) {
    // todo
  }

  applyFilters() {
    // todo
    this.close();
  }

  close() {
    this._modalCtrl.dismiss();
  }

  ngOnInit() {
  }

}
