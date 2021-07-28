import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '../interfaces/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiURL = `${environment.apiURL}/location`;

  constructor(private _http: HttpClient) { }

  getLocations(): Observable<Location[]> {
    return this._http.get<Location[]>(this.apiURL);
  }
}
