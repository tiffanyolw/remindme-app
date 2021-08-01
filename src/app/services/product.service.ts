import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../interfaces/order';
import { Product, Status } from './../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiURL = `${environment.apiURL}/product`;

  constructor(private _http: HttpClient) { }

  getProducts(status?: Status | Status[], expired?: boolean, categories?: number[], locations?: number[], order?: Order): Observable<Product[]> {
    let queries = [];
    if (status) {
      if (Array.isArray(status)) {
        queries.push(`status=${status.join("&status=")}`);
      } else {
        queries.push(`status=${status}`);
      }
    }
    if (expired != null) {
      queries.push(`expired=${expired}`);
    }
    if (categories?.length > 0) {
      queries.push(`categoryId=${categories.join("&categoryId=")}`);
    }
    if (locations?.length > 0) {
      queries.push(`locationStoredId=${locations.join("&locationStoredId=")}`);
    }
    if (order) {
      queries.push(`orderBy=${order.orderBy}`);
      queries.push(`ordering=${order.ordering}`);
    }

    let queryString = queries.length > 0 ? `?${queries.join("&")}` : "";

    return this._http.get<Product[]>(this.apiURL + queryString);
  }

  getProductById(id: number): Observable<Product> {
    return this._http.get<Product>(`${this.apiURL}/id/${id}`);
  }

  addProduct(body: Product): Observable<Product> {
    return this._http.post<Product>(`${this.apiURL}/add`, body);
  }

  updateProduct(id: number, body: Product): Observable<Product> {
    return this._http.put<Product>(`${this.apiURL}/update/id/${id}`, body);
  }

  deleteProduct(id: number): Observable<Product> {
    return this._http.delete<Product>(`${this.apiURL}/delete/id/${id}}`);
  }
}
