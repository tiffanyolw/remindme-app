import { Component } from '@angular/core';
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

  public accountPages = [
    { title: 'Account Settings', url: '/account/account-settings', icon: 'settings' },
    { title: 'Log Out', url: '/account/logout', icon: 'log-out' }
  ];

  constructor() {}
}
