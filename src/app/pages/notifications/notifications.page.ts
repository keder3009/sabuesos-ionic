import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EntityService } from 'src/app/services/entity.service';
import { INotification } from 'src/app/shared/types/notification.interface';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { IEntity } from 'src/app/shared/types/entity.interface';
import { IUser } from 'src/app/shared/types/user.interface';
import { LoadingService } from "../../services/loading.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage {
  notifications: INotification[] = [];
  public userInfo: any;
  private userEmail: string;
  public currentUser: string = '';
  public entityInfo: IEntity;

  constructor(public notificationService: NotificationService, private authService: AuthService, private userService: UserService, private entityService: EntityService,
    private loadingService: LoadingService) { }

  async ionViewWillEnter() {
    this.getInformation()
    this.userInfo = await this.authService.getUser();
  }

  async getInformation() {
    try {
      await this.loadingService.showLoading();
      this.userEmail = await this.authService.getUserActive();
      if (await this.authService.getRoleUserActive() !== '2') {
        if (!this.userInfo) {
          this.userInfo = await this.userService.getUserByEmail(this.userEmail);
        }
        this.currentUser = this.userInfo?._id;
      } else {
        this.entityInfo = await this.entityService.getEntityByEmail(this.userEmail);
        this.currentUser = this.entityInfo?._id;
      }
      this.notifications = this.notificationService.notificationsByStorage();
      console.log(this.notifications, 'notifications');
      await this.loadingService.hideLoading();
    } catch (e: any) {
      await this.loadingService.hideLoading();
      console.error(e);
    }

  }

  async deleteNotifications() {
    try {
      this.loadingService.showLoading();
      await this.notificationService.deleteNotifications();
      this.notifications = [];
      this.loadingService.hideLoading();
    } catch (e: any) {
      this.loadingService.hideLoading();
      console.error(e);
    }
  }

  async handleRefresh(event?: any) {
    setTimeout(async () => {
      this.notifications = await this.notificationService.notificationsByStorage();
      if (event) {
        event.target.complete();
      }
    }, 5000);
  }
}
