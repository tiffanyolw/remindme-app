import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product, Status } from './../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiURL = `${environment.apiURL}/product`;

  constructor(private _http: HttpClient) { }

  getProducts(status?: Status, expired?: boolean, categories?: string[], locations?: string[], orderBy?: string, ordering?: string): Observable<Product[]> {
    let queries = [];
    if (status) {
      queries.push(`status=${status}`);
    }
    if (expired != null) {
      queries.push(`expired=${expired}`);
    }
    if (categories?.length > 0) {
      queries.push(`category=${categories.join("&category=")}`);
    }
    if (locations?.length > 0) {
      queries.push(`location=${locations.join("&location=")}`);
    }
    if (orderBy) {
      queries.push(`orderBy=${orderBy}`);
    }
    if (ordering) {
      queries.push(`ordering=${ordering}`);
    }

    let queryString = queries.length > 0 ? `?${queries.join("&")}` : "";

    return this._http.get<Product[]>(this.apiURL + queryString);
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
