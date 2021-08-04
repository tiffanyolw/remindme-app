import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _localNotifications: LocalNotifications) { }

  scheduleBeforeExpiryNotification(date: Date, product: Product) {
    this._localNotifications.schedule({
      id: this.getNotificationId(product.id, NotificationType.BeforeExpiry),
      title: `${product.name} expiring in ${product.daysBeforeNotify} days`,
      text: `${product.name} is about to expire. Please try to consume it before it expires to reduce waste.`,
      trigger: { at: date },
      led: "FF0000",
      sound: null
    });
  }

  scheduleOnExpiryNotification(date: Date, product: Product) {
    this._localNotifications.schedule({
      id: this.getNotificationId(product.id, NotificationType.OnExpiry),
      title: `${product.name} expiring today`,
      text: `${product.name} is expiring today. Please try to consume it today to reduce waste.`,
      trigger: { at: date },
      led: "FF0000",
      sound: null
    });
  }

  scheduleAfterExpiryNotification(date: Date, product: Product) {
    this._localNotifications.schedule({
      id: this.getNotificationId(product.id, NotificationType.AfterExpiry),
      title: `${product.name} has expired ${product.daysAfterNotify} days ago`,
      text: `${product.name} has expired.`,
      trigger: { at: date },
      led: "FF0000",
      sound: null
    });
  }

  clearNotifications(id: number) {
    // cancel the notifications
    this._localNotifications.cancel([
      this.getNotificationId(id, NotificationType.BeforeExpiry),
      this.getNotificationId(id, NotificationType.OnExpiry),
      this.getNotificationId(id, NotificationType.AfterExpiry)
    ]);
  }

  // get unique ids for each notification
  private getNotificationId(productId: number, notifType: NotificationType) {
    // 3i - 2 : notification id of days before expiry
    // 3i - 1 : notification id for on expiry day
    // 3i     : notification id for days after expiry
    if (notifType === NotificationType.BeforeExpiry) {
      return 3 * productId - 2;
    } else if (notifType === NotificationType.OnExpiry) {
      return 3 * productId - 1;
    } else if (notifType === NotificationType.AfterExpiry) {
      return 3 * productId;
    } else {
      return 0;
    }
  }
}

enum NotificationType {
  BeforeExpiry = 1,
  OnExpiry = 2,
  AfterExpiry = 3
}
