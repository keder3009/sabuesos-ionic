import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonList, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ReportService } from 'src/app/services/report.service';
import { UserService } from 'src/app/services/user.service';
import { IReport, TypePost } from 'src/app/shared/types/report.interface';
import { IUser } from 'src/app/shared/types/user.interface';
import { DataChat } from '../chat/types/chat.interface';
import { Share } from '@capacitor/share';
import { IEntity } from 'src/app/shared/types/entity.interface';
import { EntityService } from 'src/app/services/entity.service';
import { LINK_TREE_URL } from 'src/app/shared/types/link-tree.interface';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.page.html',
  styleUrls: ['./view-report.page.scss'],
})
export class ViewReportPage implements OnInit {
  @ViewChild(IonList) ionList: IonList;

  private id: string;
  public userInfo: any;
  private userEmail: string;
  public reportInfo: IReport;
  public currentUser: string = '';
  public entityInfo: IEntity;
  public hiddenMessageOption = false;
  public routePrevious = '';

  constructor(private navCtrl: NavController, private activatedRoute: ActivatedRoute, private loadingService: LoadingService, private userService: UserService,
    private reportService: ReportService, private authService: AuthService, private alertService: AlertService, private chatService: ChatService, private router: Router,
    private entityService: EntityService) { }

  async ngOnInit() {
    this.userInfo = await this.authService.getUser();
    await this.getInformation();
  }

  async ionViewWillEnter() {
    this.userInfo = await this.authService.getUser();
    this.loadingService.showLoading();
    await this.getInformation();
    this.loadingService.hideLoading();
  }

  /**
   * Get information
   */
  async getInformation() {
    try {
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
      this.id = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.id) {
        this.reportInfo = await this.reportService.getReportById(this.id);
        console.log(this.reportInfo);

      }
      this.routePrevious = this.activatedRoute.snapshot.paramMap.get('route');
      if (((this.reportInfo?.users && this.reportInfo?.users?._id) || (this.reportInfo?.entities && this.reportInfo?.entities?._id)) === this.currentUser) {
        this.hiddenMessageOption = true;
      } else {
        this.hiddenMessageOption = false;
      }
    } catch (error) {
      console.error(error);
      this.alertService.presentToast('Ocurrio un error. Verifique con soporte o intente nuevamente')
    }

  }

  /**
   * Go to chat
   */
  async goToChat() {
    try {
      this.loadingService.showLoading();
      const dataChat: DataChat = {
        post: this.id,
        userSend: this.userInfo ? this.userInfo?._id : this.entityInfo?._id,
        userReceived: this.reportInfo?.users ? this.reportInfo?.users?._id : this.reportInfo?.entities?._id,
        userSendName: this.userInfo ? this.userInfo?.name : this.entityInfo?.name
      };
      const previousChat = await this.chatService.checkIfChatExist(dataChat);
      if (previousChat) {
        this.navCtrl.navigateRoot(['main-tab/chat', this.reportInfo._id, previousChat._id], { replaceUrl: true });
      } else {
        this.navCtrl.navigateRoot(['main-tab/chat', this.reportInfo._id, ''], { replaceUrl: true });
      }
      this.loadingService.hideLoading();
    } catch (error) {
      console.error(error);
      this.alertService.presentToast('Ocurrio un error enviando el mensaje');
      this.loadingService.hideLoading();
    }
  }

  /**
   * Add report to favorite
   * @param report
   */
  async favorite(report: IReport) {
    try {

      this.loadingService.showLoading();
      this.ionList.closeSlidingItems();
      if (await this.authService.getRoleUserActive() !== '2') {
        await this.reportService.addFavoriteUser(report._id, this.userInfo?.email)
      } else {
        await this.reportService.addFavoriteEntity(report._id, this.entityInfo?.email)
      }
      this.alertService.presentToast('Se ha agregado el reporte a sus favoritos');
      this.goToPage();
    } catch (error) {
      console.error(error);
      this.alertService.presentToast('Se ha producido un error al agregar el reporte a sus favoritos')
    }
    this.loadingService.hideLoading();
  }

  /**
   * Share
   * @param report
   */
  async share(report: IReport) {
    let message = '';
    switch (report.typePost) {
      case TypePost.LOST:
        message = `Ayuda a ${report?.users?.name} a encontrar a su mascota ${report?.pets?.name} que se encuentra extraviada. Para ayudarle descarga la App Sabuesos de Playstore  o Appstore.`;
        break;
      case TypePost.FIND:
        message = `${report?.users?.name} encontró una mascota que está extraviada y busca su familia con urgencia. Para ayudarle descarga la App Sabuesos de Playstore o Appstore.`;
        break;
      case TypePost.ADOPTION:
        message = `Ayuda a esta mascota ${report?.pets?.name} para que tenga un hogar. Para ayudarle descarga la App Sabuesos de Playstore o Appstore.`;
        break;
      default:
        message = `Ayuda a encontrar a su mascota. Para ayudarle descarga la App Sabuesos de Playstore  o Appstore.`;
        break;
    }
    await Share.share({
      title: report?.description,
      text: message,
      url: LINK_TREE_URL,
      dialogTitle: 'Compartir con',
    });
    this.ionList.closeSlidingItems();
  }

  /**
   * Go to page my favorite
   */
  goToPage() {
    this.navCtrl.navigateRoot(['main-tab/my-favorite', this.router.url], { replaceUrl: true });
  }

  getTypePet(typePet: number): string {
    switch (typePet) {
      case 0:
        {
          return 'Perro';
        }
      case 1:
        {
          return 'Gato';
        }
      case 2:
        {
          return 'Otro';
        }
      default:
        {
          return 'NA'
        }
    }
  }
}
