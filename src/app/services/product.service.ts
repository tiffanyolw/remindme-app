import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from './../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiURL = `${environment.apiURL}/product`;

  constructor(private _http: HttpClient) { }

  getProducts(status?: string, orderBy?: string, order?: string): Observable<Product[]> {
    let query = status ? `status=${status}` : "";
    query = orderBy ? `${query}&orderBy=${orderBy}` : query;
    query = orderBy && order ? `${query}&order=${order}` : query;

    return this._http.get<Product[]>(`${this.apiURL}?${query}`);
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
