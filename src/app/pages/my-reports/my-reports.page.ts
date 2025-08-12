import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-my-reports',
  templateUrl: './my-reports.page.html',
  styleUrls: ['./my-reports.page.scss'],
})
export class MyReportsPage {
  @ViewChild(IonList) ionList: IonList;
  optionsSegment: 'my-reports';

  public reportsList: IAdReport[] = [];
  public typeReportList: number = 0;
  public userEmail: string;
  public userInfo: any;
  public entityInfo: IEntity;

  public nativeAds: any[] = [];

  constructor(private navCtrl: NavController, private reportService: ReportService, private alertService: AlertService, private authService: AuthService,
    private loadingService: LoadingService,
    private userService: UserService, private entityService: EntityService,
    private router: Router, private admobService: AdmobService) { }

  async ngOnInit() {
    this.admobService.nativeAds$.subscribe(ads => {
      if (ads) {
        this.nativeAds = ads;
      }
    });
  }
  async ionViewWillEnter() {
    this.userInfo = await this.authService.getUser();
    await this.getReports();
  }

  /**
   * Get Reports
   */
  async getReports() {
    try {
      this.loadingService.temporayLoading(3000);
      this.userEmail = await this.authService.getUserActive();
      if (await this.authService.getRoleUserActive() !== '2') {
        if (!this.userInfo) {
          this.userInfo = await this.userService.getUserByEmail(this.userEmail);
        }
        this.reportsList = await this.reportService.getReportsByUser(this.userEmail).toPromise();
        this.addList();
      } else {
        this.entityInfo = await this.entityService.getEntityByEmail(this.userEmail);
        this.reportsList = await this.reportService.getReportsByEntity(this.userEmail).toPromise();
        this.addList();
      }
    } catch (error) {
      console.error(error);
      this.alertService.presentToast('Se ha producido un error al agregar sus reportes')
    }

  }

  addList() {
    let adIndex = 0;
    let finalList: IAdReport[] = [];

    this.reportsList.forEach((report, index) => {
      finalList.push(report);

      if ((index + 1) % 2 === 0 && this.nativeAds.length > 0) {
        let adData = this.nativeAds[adIndex % this.nativeAds.length];
        finalList.push({ isAd: true, ...adData } as unknown as IAdReport);
        adIndex++;
      }
    });

    this.reportsList = finalList;
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

  /**
   * Change if select is changed
   * @param event
   */
  segmentChanged(event: any) {
    this.typeReportList = event.detail.value;
  }

  async favorite(report: IReport) {
    try {
      this.loadingService.showLoading();
      this.ionList.closeSlidingItems();
      if (await this.authService.getRoleUserActive() !== '2') {
        await this.reportService.addFavoriteUser(report._id, this.userInfo?.email)
      } else {
        await this.reportService.addFavoriteEntity(report._id, this.entityInfo.email)
      }
      this.loadingService.hideLoading();
      this.alertService.presentToast('Se ha agregado el reporte a sus favoritos');
      this.goToPage();
    } catch (error) {
      console.error(error);
      this.loadingService.hideLoading();
      this.alertService.presentToast('Se ha producido un error al agregar el reporte a sus favoritos')
    }
  }

  /**
   * Share report
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
   * Delete report
   * @param report
   */
  async delete(report: IReport) {
    try {
      this.loadingService.showLoading();
      await this.reportService.deleteReport(report._id);
      this.loadingService.hideLoading();
      this.alertService.presentToast('Se elimino el reporte registrado');
      await this.getReports();
    } catch (error) {
      this.loadingService.hideLoading();
      console.error(error);
      this.alertService.presentToast('Se presento un error elimando el reporte. Intente nuevamente');
    }
    this.ionList.closeSlidingItems();

  }

  /**
   * Update report
   * @param report
   */
  async update(report: IReport) {
    this.navCtrl.navigateRoot(['main-tab/create-report', report._id, this.router.url]);
  }

  /**
   * Go to my favorite page
   */
  goToPage() {
    this.navCtrl.navigateRoot(['main-tab/my-favorite', this.router.url]);
  }

  async handleRefresh(event: any) {
    setTimeout(async () => {
      this.reportsList = await this.reportService.getReportsByUser(this.userEmail).toPromise();
      event.target.complete();
    }, 3000);
  }
}
