import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiURL = `${environment.apiURL}/user`;

  constructor(private _http: HttpClient) { }

  login(body: User): Observable<User> {
    return this._http.post<User>(`${this.apiURL}/login`, body);
  }

  register(body: User): Observable<User> {
    return this._http.post<User>(`${this.apiURL}/register`, body);
  }

  logout() {
    return localStorage.removeItem("currentUser");
  }

  updateUser(body: User) {
    return this._http.patch<User>(`${this.apiURL}/update/user/${this.getCurrentUser().id}`, body);
  }

  updateUserPassword(body: any) {
    return this._http.patch<User>(`${this.apiURL}/update-password/user/${this.getCurrentUser().id}`, body);
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem("currentUser")!);
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() ? true : false;
  }
}
