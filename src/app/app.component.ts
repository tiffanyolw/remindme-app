import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public mainPages = [
    { title: 'Inventory', url: '/inventory', icon: 'mail' },
    { title: 'Consumed', url: '/consumption', icon: 'paper-plane' },
    { title: 'Groceries List', url: '/groceries', icon: 'heart' }
  ];

  public customListPages = [
    { title: 'Products', url: '/custom/products', icon: 'settings' },
    { title: 'Categories', url: '/custom/categories', icon: 'log-out' },
    { title: 'Units', url: '/custom/units', icon: 'log-out' },
    { title: 'Storage Locations', url: '/custom/storage', icon: 'log-out' }
  ];

  public accountPages = [
    { title: 'Account Settings', url: '/account/account-settings', icon: 'settings' },
    { title: 'Log Out', url: '/account/logout', icon: 'log-out' }
  ];

  constructor() {}
}
