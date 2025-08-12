import { Component, ViewChild } from '@angular/core';
import { IonList, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { EntityService } from 'src/app/services/entity.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UserService } from 'src/app/services/user.service';
import { IEntity } from 'src/app/shared/types/entity.interface';
import { IUser } from 'src/app/shared/types/user.interface';
import { ChatMessage, IChat } from '../chat/types/chat.interface';

@Component({
  selector: 'app-my-chats',
  templateUrl: './my-chats.page.html',
  styleUrls: ['./my-chats.page.scss'],
})
export class MyChatsPage {
  @ViewChild(IonList) ionList: IonList;
  usuarios: Observable<any>;
  public currentUser: any | IEntity;
  public userEmail: string;
  public chats: any[] = [];

  constructor(
    private chatService: ChatService, private authService: AuthService, private userService: UserService, private loadingService: LoadingService,
    public navCtrl: NavController, private alertService: AlertService, private entityService: EntityService
  ) { }

  async ionViewWillEnter() {
    this.currentUser = await this.authService.getUser();
    await this.initialize();
  }

  async initialize() {
    try {
      this.loadingService.temporayLoading(3000);
      this.userEmail = await this.authService.getUserActive();
      if (await this.authService.getRoleUserActive() !== '2') {
        if (!this.currentUser) {
          this.currentUser = await this.userService.getUserByEmail(this.userEmail);
        }
      } else {
        this.currentUser = await this.entityService.getEntityByEmail(this.userEmail);
      }
      this.chats = await this.chatService.getAllChats(this.currentUser._id);
    } catch (error) {
      console.error(error)
    }
  }

  favorite(user: any) {
    this.ionList.closeSlidingItems();
  }

  share(user: any) {
    this.ionList.closeSlidingItems();
  }

  async delete(chat: any) {
    try {
      await this.chatService.deleteChat(chat._id);
      this.alertService.presentToast('Se elimino el chat seleccionado');
      await this.initialize();
    } catch (error) {
      console.error(error);
      this.alertService.presentToast('Se presento un error elimando el chat. Intente nuevamente');
    }
    this.ionList.closeSlidingItems();
  }

  goToChat(chat: any) {
    this.navCtrl.navigateRoot(['main-tab/chat', chat.post._id, chat._id]);
  }

  async handleRefresh(event: any) {
    setTimeout(async () => {
      this.chats = await this.chatService.getAllChats(this.currentUser._id);
      event.target.complete();
    }, 3000);
  }
}
