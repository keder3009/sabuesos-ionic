import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CitiesService, ICities } from 'src/app/services/cities.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UserService } from 'src/app/services/user.service';
import { IEntity } from 'src/app/shared/types/entity.interface';
import { AllValidationErrors, getFormValidationErrors, searchFormError } from 'src/app/shared/types/get-errors-form';
import { Role } from 'src/app/shared/types/role.interface';
import { IRegister } from '../register/types/register-form.interface';
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.page.html',
  styleUrls: ['./organization-form.page.scss'],
})
export class OrganizationFormPage {
  public cities: ICities[] = [];
  public registerForm: FormGroup;
  public emailPattern: any =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public checkedActive: boolean = true;
  public routePrevious: string = '';
  public isModalOpen = false;

  constructor(private fb: FormBuilder, private alertService: AlertService, private authService: AuthService, public navCtrl: NavController,
    private citiesService: CitiesService, private firebaseService: FirebaseService, private loadingService: LoadingService, private userService: UserService,
    private activatedRoute: ActivatedRoute, private notificationService: NotificationService) {
      this.registerForm = this.fb.group({
        nameOrganization: ['', [Validators.required, Validators.maxLength(60),]],
        NIT: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
        email: ['', [Validators.pattern(this.emailPattern), Validators.required, Validators.maxLength(60)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
        retypePassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
        phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(11)]],
        contactPerson: ['', [Validators.required, Validators.maxLength(60)]],
        city: ['', [Validators.required]],
        picture: [''],
        address: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(60)]],
        webpage: ['', [Validators.required, Validators.maxLength(120)]],
        socialNetworks: ['', [Validators.maxLength(120)]],
        facebook: ['', [Validators.maxLength(120)]],
        twitter: ['', [Validators.maxLength(120)]],
        authorizationOrganization: [''],
      })
    }

  async ionViewWillEnter() {
    await this.getSelectorsOptions();
  }

  /**
   * Get selectors options
   */
  async getSelectorsOptions() {
    this.routePrevious = this.activatedRoute.snapshot.paramMap.get('route');
    this.cities = await this.citiesService.getCities();

  }

  /**
   * Register entity
   * @returns
   */
  async register() {
    try {
      this.loadingService.showLoading();
      if (!this.checkedActive) {
        this.loadingService.hideLoading();
        this.alertService.infoAlert("El campo autorizo el uso de la información es requerido")
        return;
      }
      if (this.registerForm.valid) {
        if ((this.registerForm.get('password')?.value !== this.registerForm.get('retypePassword')?.value)) {
          this.alertService.infoAlert('Los passwords ingresados no son iguales.');
          return;
        }
        const entityForm: IEntity = {
          name: this.registerForm.get('nameOrganization')?.value,
          email: this.registerForm.get('email')?.value,
          city: this.registerForm.get('city')?.value,
          document: this.registerForm.get('NIT')?.value,
          phone: this.registerForm.get('phone')?.value,
          contactPerson: this.registerForm.get('contactPerson')?.value,
          address: this.registerForm.get('address')?.value,
          webpage: this.registerForm.get('webpage')?.value,
          facebook: this.registerForm.get('facebook')?.value,
          twitter: this.registerForm.get('twitter')?.value,
          socialNetworks: this.registerForm.get('socialNetworks')?.value,
          role: Role.ENTITY,
        }
        const entityRegister = await this.authService.registerOrganization(entityForm);
        await this.notificationService.setOneSignalExternalId(entityRegister._id);
        const res = await this.firebaseService.RegisterUser(this.registerForm.get('email')?.value, this.registerForm.get('password')?.value);
        await this.firebaseService.SendVerificationMail();
        this.registerForm.reset();
        this.alertService.presentToast('Se ha registrado exitosamente.').then(() => {
          this.goToPage();
        }
        );
      } else {
        const errorForm: AllValidationErrors = getFormValidationErrors(
          this.registerForm.controls
        ).shift() as any;
        this.alertService.infoAlert(searchFormError(errorForm));
      }
    } catch (error) {
      console.error(error);
      this.alertService.infoAlert('Ocurrio un error al intentar registrarse. Intentelo de nuevo');
    }
    this.loadingService.hideLoading();
  }

  /**
   * Go to verify email page
   */
  goToPage() {
    this.navCtrl.navigateForward(['main-tab/verify-email']);
  }

  checkboxClick() {
    this.checkedActive = !this.checkedActive;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
