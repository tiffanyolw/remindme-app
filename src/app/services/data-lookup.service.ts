import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../interfaces/category';
import { Location } from '../interfaces/location';
import { Unit } from '../interfaces/unit';

@Injectable({
  providedIn: 'root'
})
export class DataLookupService {
  private apiURL = environment.apiURL;
  categories: Category[] = [];
  locations: Location[] = [];
  units: Unit[] = [];

  constructor(private _http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    const obs = this._http.get<Category[]>(`${this.apiURL}/category`);
    // store the result in the service
    obs.subscribe((result) => {
      this.categories = result;
    }, () => {
      this.categories = [];
    });
    return obs;
  }

  getLocations(): Observable<Location[]> {
    const obs = this._http.get<Location[]>(`${this.apiURL}/location`);
    // store the result in the service
    obs.subscribe((result) => {
      this.locations = result;
    }, () => {
      this.locations = [];
    });
    return obs;
  }

  getUnits(): Observable<Unit[]> {
    const obs = this._http.get<Unit[]>(`${this.apiURL}/unit`);
    // store the result in the service
    obs.subscribe((result) => {
      this.units = result;
    }, () => {
      this.units = [];
    });
    return obs;
  }

}
