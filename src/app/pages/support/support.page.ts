import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { EntityService } from 'src/app/services/entity.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UserService } from 'src/app/services/user.service';
import { IEntity } from 'src/app/shared/types/entity.interface';
import { AllValidationErrors, getFormValidationErrors, searchFormError } from 'src/app/shared/types/get-errors-form';
import { ISupport } from 'src/app/shared/types/support.interface';
import { IUser } from 'src/app/shared/types/user.interface';
import { SupportService } from 'src/app/services/support.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage {
  public supportForm: FormGroup;
  public userInfo: any;
  public entityInfo: IEntity;
  public email: string;
  public idUser: string;

  constructor(private alertService: AlertService, private fb: FormBuilder, private router: Router, private supportService: SupportService,
    private loadingService: LoadingService, private authService: AuthService, private userService: UserService, private entityService: EntityService) {
    this.supportForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(250)]]
    })
  }

  async ionViewWillEnter() {
    await this.getUserInfo();
    this.userInfo = await this.authService.getUser();
  }

  async getUserInfo() {
    try {
      this.loadingService.showLoading();
      this.email = await this.authService.getUserActive();
      if (await this.authService.getRoleUserActive() !== '2') {
        if (!this.userInfo) {
          this.userInfo = await this.userService.getUserByEmail(this.email);
        }
        this.idUser = this.userInfo._id;
      } else {
        this.entityInfo = await this.entityService.getEntityByEmail(this.email);
        this.idUser = this.entityInfo._id;
      }
      this.loadingService.hideLoading();
    } catch (error) {
      this.loadingService.hideLoading();
      console.error(error);
      this.alertService.infoAlert('Ocurrio un error al obtener la información del usuario');
    }
  }

  /**
   * onSubmit
   */
  async onSubmit() {
    try {
      this.loadingService.showLoading();
      if (this.supportForm.valid) {
        const supportForm: ISupport = {
          description: this.supportForm.get('description').value,
          idUser: this.idUser
        }
        await this.supportService.createSupport(supportForm)
        this.loadingService.hideLoading();
        this.alertService.infoAlert('Se ha registrado su solicitud de soporte.');
        this.supportForm.reset();
        this.router.navigate(['main-tab/list-reports']);
      } else {
        const errorForm: AllValidationErrors = getFormValidationErrors(
          this.supportForm.controls
        ).shift() as any;
        this.alertService.infoAlert(searchFormError(errorForm));
      }
    } catch (error) {
      this.loadingService.hideLoading();
      console.error(error);
      this.alertService.infoAlert('Ocurrio un error al enviar el mensaje');
    }
  }
}
