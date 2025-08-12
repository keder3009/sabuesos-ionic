import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AllValidationErrors, getFormValidationErrors, searchFormError } from 'src/app/shared/types/get-errors-form';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.page.html',
  styleUrls: ['./recovery-password.page.scss'],
})
export class RecoveryPasswordPage {
  public recoveryForm: FormGroup;
  public emailPattern: any =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public routePrevious = '';

  constructor(private firebaseService: FirebaseService, private fb: FormBuilder, private alertService: AlertService,
    public navCtrl: NavController, private loadingService: LoadingService, private activatedRoute: ActivatedRoute) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.pattern(this.emailPattern), Validators.required, Validators.maxLength(60)]],
    })
  }

  async ionViewWillEnter() {
    this.loadingService.showLoading();
    await this.getInformation();
    this.loadingService.hideLoading();
  }

  public getInformation() {
    this.routePrevious = this.activatedRoute.snapshot.paramMap.get('route');
  }

  async onSubmit() {
    try {
      this.loadingService.showLoading();
      if (this.recoveryForm.valid) {
        await this.firebaseService.PasswordRecover(this.recoveryForm.get('email').value);
      } else {
        const errorForm: AllValidationErrors = getFormValidationErrors(
          this.recoveryForm.controls
        ).shift() as any;
        this.alertService.infoAlert(searchFormError(errorForm));
      }
    } catch (error) {
      console.error(error);
      this.alertService.infoAlert('Ocurrio un error al enviar el correo. Intentelo de nuevo');
    }
    this.loadingService.hideLoading();
  }

  goToMainPage() {
    this.navCtrl.navigateForward(['main-tab/list-reports']);
  }
}
