import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage {
  public routePrevious = '';

  constructor(private firebaseService: FirebaseService, public navCtrl: NavController, private alertService: AlertService,
    private loadingService: LoadingService, private activatedRoute: ActivatedRoute) { }

  async ionViewWillEnter() {
    this.loadingService.showLoading();
    await this.getInformation();
    this.loadingService.hideLoading();
  }

  public getInformation() {
    this.routePrevious = this.activatedRoute.snapshot.paramMap.get('route');
  }

  /**
   * Verify email
   */
  verifyEmail() {
    try {
      this.loadingService.showLoading();
      this.navCtrl.navigateForward(['main-tab/verify-email']);
      this.loadingService.hideLoading();
    } catch (error) {
      this.loadingService.hideLoading();
    }
  }

  /**
   * Go to main page
   */
  goToMainPage() {
    this.navCtrl.navigateForward(['main-tab/list-reports']);
  }
}
