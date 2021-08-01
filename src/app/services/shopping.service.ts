import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../interfaces/order';
import { ShoppingItem } from '../interfaces/shoppingItem';
import { User } from '../interfaces/user';
import { UserService } from './account/user.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  private apiURL = `${environment.apiURL}/shopping`;

  constructor(private _http: HttpClient, private _userService: UserService) { }

  getItems(bought?: boolean, cleared?: boolean, categories?: number[], stores?: string[], order?: Order): Observable<ShoppingItem[]> {
    let queries = [];
    queries.push(`userId=${this._userService.getCurrentUser().id}`);
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

  getItemById(id: number): Observable<ShoppingItem> {
    return this._http.get<ShoppingItem>(`${this.apiURL}/id/${id}`);
  }

  addItem(body: ShoppingItem): Observable<ShoppingItem> {
    body.userId = this._userService.getCurrentUser().id;
    return this._http.post<ShoppingItem>(`${this.apiURL}/add`, body);
  }

  updateItems(id: number, body: ShoppingItem): Observable<ShoppingItem> {
    body.userId = this._userService.getCurrentUser().id;
    return this._http.put<ShoppingItem>(`${this.apiURL}/update/id/${id}`, body);
  }

  deleteItems(id: number): Observable<ShoppingItem> {
    return this._http.delete<ShoppingItem>(`${this.apiURL}/delete/id/${id}}`);
  }
}
