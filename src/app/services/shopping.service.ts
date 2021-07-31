import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShoppingItem } from '../interfaces/shoppingItem';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  private apiURL = `${environment.apiURL}/grocery`;

  constructor(private _http: HttpClient) { }

  getGroceries(bought?: boolean): Observable<ShoppingItem[]> {
    let query = bought ? `?bought=${bought}` : ""; // if bought !== undefined

    return this._http.get<ShoppingItem[]>(`${this.apiURL}?${query}`);
  }

  addGrocery(body: ShoppingItem): Observable<ShoppingItem> {
    return this._http.post<ShoppingItem>(`${this.apiURL}/add`, body);
  }

  updateGrocery(id: number, body: ShoppingItem): Observable<ShoppingItem> {
    return this._http.put<ShoppingItem>(`${this.apiURL}/update/id/${id}`, body);
  }

  deleteGrocery(id: number): Observable<ShoppingItem> {
    return this._http.delete<ShoppingItem>(`${this.apiURL}/delete/id/${id}}`);
  }
}
