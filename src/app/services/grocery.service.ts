import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Grocery } from '../interfaces/grocery';

@Injectable({
  providedIn: 'root'
})
export class GroceryService {
  private apiURL = `${environment.apiURL}/grocery`;

  constructor(private _http: HttpClient) { }

  getGroceries(bought?: boolean): Observable<Grocery[]> {
    let query = bought ? `?bought=${bought}` : "";

    return this._http.get<Grocery[]>(`${this.apiURL}?${query}`);
  }

  addGrocery(body: Grocery): Observable<Grocery> {
    return this._http.post<Grocery>(`${this.apiURL}/add`, body);
  }

  updateGrocery(id: number, body: Grocery): Observable<Grocery> {
    return this._http.put<Grocery>(`${this.apiURL}/update/id/${id}`, body);
  }

  deleteGrocery(id: number): Observable<Grocery> {
    return this._http.delete<Grocery>(`${this.apiURL}/delete/id/${id}}`);
  }

}
