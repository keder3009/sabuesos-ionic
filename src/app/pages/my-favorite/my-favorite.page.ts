import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { IonList, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { EntityService } from 'src/app/services/entity.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ReportService } from 'src/app/services/report.service';
import { UserService } from 'src/app/services/user.service';
import { IEntity } from 'src/app/shared/types/entity.interface';
import { LINK_TREE_URL } from 'src/app/shared/types/link-tree.interface';
import { IAdReport, IReport, TypePost } from 'src/app/shared/types/report.interface';
import { IUser } from 'src/app/shared/types/user.interface';
import { AdmobService } from "src/app/services/admod.service";

@Component({
  selector: 'app-my-favorite',
  templateUrl: './my-favorite.page.html',
  styleUrls: ['./my-favorite.page.scss'],
})
export class MyFavoritePage {
  @ViewChild(IonList) ionList: IonList;
  optionSelected(event: any) { }
  public reportList: any[] = [];
  public email: string;
  public userInfo: any;
  public entityInfo: IEntity;
  public idUser: string;
  public routePrevious: string = '';
  public nativeAds: any[] = [];

  constructor(private reportService: ReportService, private alertService: AlertService, private entityService: EntityService,
    private navCtrl: NavController, private authService: AuthService, private userService: UserService,
    private loadingService: LoadingService,
    private activatedRoute: ActivatedRoute,
   private admobService: AdmobService) {
  }

  async ngOnInit() {
    this.admobService.nativeAds$.subscribe(ads => {
      if (ads) {
        this.nativeAds = ads;
        this.addList();
      }
    });
  }

  async ionViewWillEnter() {
    this.userInfo = await this.authService.getUser();
    await this.getInformationData();
  }

  /**
   * Get information data
   */
  async getInformationData() {
    try {
      this.loadingService.temporayLoading(3000);
      this.email = await this.authService.getUserActive();
      if (await this.authService.getRoleUserActive() !== '2') {
        if (!this.userInfo) {
          this.userInfo = await this.userService.getUserByEmail(this.email);
        }
        this.idUser = this.userInfo?._id;
        this.reportList = await (await this.reportService.getFavoritiesByIdUser(this.email))
        this.addList();
      } else {
        this.entityInfo = await this.entityService.getEntityByEmail(this.email);
        this.idUser = this.entityInfo._id;
        this.reportList = await (await this.reportService.getFavoritiesByIdEntity(this.email))
        this.addList();
      }
      this.routePrevious = this.activatedRoute.snapshot.paramMap.get('route');
    } catch (error) {
      console.error(error);
      this.alertService.presentToast('Ocurrio un error intente de nuevo');
    }
  }

  /**
   * Share data
   * @param report
   */
  async share(report: IReport) {
    let message = '';
    switch (report.typePost) {
      case TypePost.LOST:
        message = `Ayuda a ${report.users.name} a encontrar a su mascota ${report.pets.name} que se encuentra extraviada. Para ayudarle descarga la App Sabuesos de Playstore  o Appstore.`;
        break;
      case TypePost.FIND:
        message = `${report.users.name} encontró una mascota que está extraviada y busca su familia con urgencia. Para ayudarle descarga la App Sabuesos de Playstore o Appstore.`;
        break
      case TypePost.ADOPTION:
        message = `Ayuda a esta mascota ${report.pets.name} para que tenga un hogar. Para ayudarle descarga la App Sabuesos de Playstore o Appstore.`;
        break;
      default:
        message = `Ayuda a encontrar a su mascota. Para ayudarle descarga la App Sabuesos de Playstore  o Appstore.`;
        break;
    }
    await Share.share({
      title: report.description,
      text: message,
      url: LINK_TREE_URL,
      dialogTitle: 'Compartir con',
    });
    this.ionList.closeSlidingItems();
  }

  /**
   * Delete a report
   * @param report
   */
  async delete(report: IReport) {
    try {
      this.loadingService.showLoading();
      this.ionList.closeSlidingItems();
      if (await this.authService.getRoleUserActive() !== '2') {
        const index = report.favoriteUsers.findIndex((favorite) => favorite._id === this.idUser);
        if (index >= 0) {
          report.favoriteUsers.splice(index, 1)
        }
      } else {
        const index = report.favoriteEntities.findIndex((favorite) => favorite._id === this.idUser);
        if (index >= 0) {
          report.favoriteEntities.splice(index, 1)
        }
      }
      await this.reportService.updateReport(report._id, report);
      await this.handleRefresh();
      this.alertService.presentToast('Se ha eliminado el reporte de su lista de favoritos');
    } catch (error) {
      this.loadingService.hideLoading();
      console.error(error);
      this.alertService.presentToast('Ocurrio un error elimando el favorito. Intente de nuevo');
    }

  }

  addList() {
    let adIndex = 0;
    let finalList: IAdReport[] = [];

    this.reportList.forEach((report, index) => {
      finalList.push(report);

      if ((index + 1) % 2 === 0 && this.nativeAds.length > 0) {
        let adData = this.nativeAds[adIndex % this.nativeAds.length];
        finalList.push({ isAd: true, ...adData } as unknown as IAdReport);
        adIndex++;
      }
    });

    this.reportList = finalList;
  }

  /**
   * Go to main page
   */
  goToPage() {
    this.navCtrl.navigateRoot(['main-tab/list-reports']);
  }

  async handleRefresh(event?: any) {
    setTimeout(async () => {
      if (await this.authService.getRoleUserActive() !== '2') {
        this.reportList = await this.reportService.getFavoritiesByIdUser(this.email);
      } else {
        this.reportList = await this.reportService.getFavoritiesByIdEntity(this.email);
      }
      if (event) {
        event.target.complete();
      }
      this.loadingService.hideLoading();
    }, 3000);
  }

  async openAd(slide: any) {
    if (!slide.id) return this.openLink(slide);
    try {
      await this.admobService.openAd(slide.id);
    } catch (error) {
      console.error('Error al abrir el anuncio:', error)

    }
  }

  openLink(slide: any) {
    if (slide.link) window.open(slide.link, '_blank');
  }
}
