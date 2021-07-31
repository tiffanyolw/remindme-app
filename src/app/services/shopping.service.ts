import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../interfaces/order';
import { ShoppingItem } from '../interfaces/shoppingItem';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  private apiURL = `${environment.apiURL}/shopping`;

  constructor(private _http: HttpClient) { }

  getItems(bought?: boolean, cleared?: boolean, categories?: number[], stores?: string[], order?: Order): Observable<ShoppingItem[]> {
    let queries = [];
    if (bought != null) {
      queries.push(`bought=${bought}`);
    }

    if (cleared != null) {
      queries.push(`cleared=${cleared}`);
    }

    if (categories?.length > 0) {
      queries.push(`categoryId=${categories.join("&categoryId=")}`);
    }

    if (stores?.length > 0) {
      queries.push(`storeName=${stores.join("&storeName=")}`);
    }

    if (order) {
      queries.push(`orderBy=${order.orderBy}`);
      queries.push(`ordering=${order.ordering}`);
    }

    let queryString = queries.length > 0 ? `?${queries.join("&")}` : "";

    return this._http.get<ShoppingItem[]>(this.apiURL + queryString);
  }

  addItem(body: ShoppingItem): Observable<ShoppingItem> {
    return this._http.post<ShoppingItem>(`${this.apiURL}/add`, body);
  }

  updateGrocery(id: number, body: ShoppingItem): Observable<ShoppingItem> {
    return this._http.put<ShoppingItem>(`${this.apiURL}/update/id/${id}`, body);
  }

  deleteGrocery(id: number): Observable<ShoppingItem> {
    return this._http.delete<ShoppingItem>(`${this.apiURL}/delete/id/${id}}`);
  }
}
