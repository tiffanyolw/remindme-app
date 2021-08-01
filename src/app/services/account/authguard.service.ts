import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate{

  constructor(private _userService: UserService, private _navCtrl: NavController) { }

  canActivate(): boolean {
    if (!this._userService.isAuthenticated()) {
      this._navCtrl.navigateForward("login");
      return false;
    }
    return true;
  }
}
