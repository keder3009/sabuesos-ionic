import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ReportService } from 'src/app/services/report.service';
import { UserService } from 'src/app/services/user.service';
import { IReport } from 'src/app/shared/types/report.interface';
import { ChatMessage, DataChat } from './types/chat.interface';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { DatePipe } from '@angular/common';
import { IEntity } from 'src/app/shared/types/entity.interface';
import { EntityService } from 'src/app/services/entity.service';
import { Socket } from 'ngx-socket-io';
import { INotification } from 'src/app/shared/types/notification.interface';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  @ViewChild(IonContent) content: IonContent;
  public idReport: string;
  public idChat: string;
  public reportInfo: IReport;
  public userEmail: string;
  public message = '';
  public messages: ChatMessage[] = [];
  public currentUser: any | IEntity;
  public iconChat = 'paper-plane-outline';
  newMessage$: Observable<ChatMessage>;

  constructor(private authService: AuthService, private userService: UserService, private alertService: AlertService, private socket: Socket,
    private activatedRoute: ActivatedRoute, private chatService: ChatService, private loadingService: LoadingService, private notificationService: NotificationService,
    private reportService: ReportService, private datePipe: DatePipe, private entityService: EntityService) {

  }

  async ionViewWillEnter() {
    this.currentUser = await this.authService.getUser();
    await this.initChat();
  }

  async initChat() {
    try {
      this.loadingService.temporayLoading(3000);
      this.messages = [];
      this.chatService.connect();
      this.chatService.getMessage().subscribe((message: ChatMessage) => {
        this.messages.push(message);
      })
      this.idReport = this.activatedRoute.snapshot.paramMap.get('idReport');
      this.idChat = this.activatedRoute.snapshot.paramMap.get('idChat');
      this.userEmail = await this.authService.getUserActive();
      if (this.idReport) {
        this.reportInfo = await this.reportService.getReportById(this.idReport);
      }
      if (await this.authService.getRoleUserActive() !== '2') {
        if (!this.currentUser) {
          this.currentUser = await this.userService.getUserByEmail(this.userEmail);
        }
      } else {
        this.currentUser = await this.entityService.getEntityByEmail(await this.authService.getUserActive());
      }
      if (this.idChat) {
        this.messages = await (await this.chatService.getMessagesPrevious(this.idChat)).messages;
        this.chatService.leaveRoom(this.idChat);
        this.chatService.joinRoom(this.idChat);
      }
    } catch (error) {
      console.error(error);
      this.alertService.presentToast('Ocurrio un error, obteniendo los datos')
    }
  }

  async sendMessage() {
    try {
      const messages: ChatMessage = {
        message: this.message,
        idUser: this.currentUser.email,
        createdAt: this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm a'),
      }
      if (this.messages.length === 0 && !this.idChat) {
        const dataChat: DataChat = {
          post: this.idReport,
          userSend: this.currentUser?._id,
          userReceived: this.reportInfo?.users ? this.reportInfo?.users?._id : this.reportInfo?.entities?._id,
          userSendName: this.currentUser.name,
          userReceivedName: this.reportInfo.users ? this.reportInfo?.users?.name : this.reportInfo?.entities?.name,
        };
        const chat = await this.chatService.createChat(dataChat);
        await this.sendNotificationPush();
        this.idChat = chat._id;
        this.chatService.leaveRoom(this.idChat);
        this.chatService.joinRoom(this.idChat);
      }
      const payload: { message: ChatMessage, room: string } = {
        message: messages,
        room: this.idChat
      }
      this.chatService.sendMessage(payload);
      this.chatService.addMessages(this.idChat, messages);
      this.content.scrollToBottom();
      this.message = '';
    } catch (error) {
      console.error(error);
      this.alertService.presentToast('Ocurrio un error enviando el mensaje. Intente nuevamente');
    }
  }

  public async sendNotificationPush(){
    try {
      const userLabel = this.reportInfo?.users ? this.reportInfo?.users : this.reportInfo?.entities;
      let usersArray = [];
      usersArray.push(userLabel);
      const notification: INotification = {
        title: `Has recibido un nuevo mensaje de ${this.currentUser?.name} `,
        bodyMessage: `Visita tus chats, para ver tu mensaje `,
        users: usersArray,
        userSend: this.currentUser?._id
      };
      await this.notificationService.createNotification(notification);
    } catch(error){
      console.error(error);
      this.alertService.infoAlert('Ocurrio un error en el envío de la notificación push.')
    }
  }

  ionViewWillLeave() {
    this.chatService.disconnect();
  }

}
