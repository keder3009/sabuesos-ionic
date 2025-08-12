import { Injectable, EventEmitter } from '@angular/core';
import OneSignal from 'onesignal-cordova-plugin';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { INotification } from '../shared/types/notification.interface';
import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  userID: string;
  private _baseUrl = environment.api + '/notification';
  private _isConfigured = false;

  constructor(private http: HttpClient, private platform: Platform) { }

  initialConfiguration() {
    if (this._isConfigured) {
      return;
    }
    var iosSettings: any = {};
    iosSettings["kOSSettingsKeyAutoPrompt"] = false;
    iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
    if (Capacitor.getPlatform() != 'web') {
      OneSignal.initialize(environment.onseSignal.appId)
      OneSignal.Notifications.addEventListener('click', (data) => {
        console.log('Notification clicked:', data);
        let storedNotifications = localStorage.getItem('notifications');
        let notificationsStorage = storedNotifications ? JSON.parse(storedNotifications) : [];
        notificationsStorage.push(data.notification);
        localStorage.setItem('notifications', JSON.stringify(notificationsStorage));
      });
      this.requestPermission();

      OneSignal.Notifications.addEventListener('foregroundWillDisplay', (notificationReceivedEvent) => {
        console.log('foregroundWillDisplay 1');
        const notificationReceived = notificationReceivedEvent.getNotification();
        console.log(notificationReceived, "foregroundWillDisplay first");
        let storedNotifications = localStorage.getItem('notifications');
        let notificationsStorage = storedNotifications ? JSON.parse(storedNotifications) : [];
        notificationsStorage.push(notificationReceived);
        localStorage.setItem('notifications', JSON.stringify(notificationsStorage));
        console.log(notificationsStorage, "foregroundWillDisplay");
      });
    }
    this._isConfigured = true;
  }

  async requestPermission() {
    try {
      const permission = await OneSignal.Notifications.canRequestPermission();
      console.log('permission: ', permission);
      if (permission) {
        const accepted = await OneSignal.Notifications.requestPermission(true);
        console.log('User accepted notifications: ' + accepted);
      } else {
        console.log('permission denied: ', permission);
      }
    } catch (e) {
      throw e;
    }
  }

  public notificationsByStorage(): INotification[] {
    const storedData = localStorage.getItem('notifications');
    if (!storedData) {
      return [];
    }
    try {
      const notifications: INotification[] = JSON.parse(storedData);
      return Array.isArray(notifications) ? notifications : [];
    } catch (e) {
      console.error('Error parsing notifications from storage:', e);
      return [];
    }
  }

  async setOneSignalExternalId(id: string) {
    OneSignal.login(id);
  }

  async getOneSignalDeviceId(): Promise<string | null> {
    return await OneSignal.User.getOnesignalId();
  }

  async deleteNotifications() {
    localStorage.removeItem('notifications');
  }

  async createNotification(notification: INotification) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .post<INotification>(`${this._baseUrl}`, notification, { headers })
      .toPromise();
  }

}
