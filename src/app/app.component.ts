import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from './services/account/user.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public mainPages = [
    { title: 'Inventory', url: '/inventory', icon: 'cube' },
    { title: 'History', url: '/history', icon: 'time' },
    { title: 'Shopping List', url: '/shopping-list', icon: 'cart' }
  ];

  constructor(private _navCtrl: NavController, private _userService: UserService) { }

  logout() {
    this._userService.logout();
    this._navCtrl.navigateBack("login");
  }
}
