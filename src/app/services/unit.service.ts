import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Unit } from '../interfaces/unit';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private apiURL = `${environment.apiURL}/unit`;

  constructor(private _http: HttpClient) { }

  getUnits() {
    return this._http.get<Unit[]>(this.apiURL);
  }
}
