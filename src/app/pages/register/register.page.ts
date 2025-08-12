import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AllValidationErrors, getFormValidationErrors, searchFormError } from 'src/app/shared/types/get-errors-form';
import { Role } from 'src/app/shared/types/role.interface';
import { IRegister } from './types/register-form.interface';
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public registerForm: FormGroup;
  public emailPattern: any =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public routePrevious: string | null;
  public checkedActive: boolean = true;
  public isModalOpen = false;
  public latitude: any = null;
  public longitude: any = null;
  public nativeGeocoderResult: NativeGeocoderResult | null = null;

  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };


  constructor(
    private fb: FormBuilder,
    private nativeGeocoder: NativeGeocoder,
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private firebaseService: FirebaseService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(60),]],
      email: ['', [Validators.pattern(this.emailPattern), Validators.required, Validators.maxLength(60)]],
      password: ['', [Validators.minLength(8), Validators.maxLength(20)]],
      retypePassword: ['', [Validators.minLength(8), Validators.maxLength(20)]],
      authorizationUser: [''],
    })
  }

  ngOnInit() {
    this.routePrevious = this.activatedRoute.snapshot.paramMap.get('route');
  }

  async ionViewWillEnter() {
    this.routePrevious = this.activatedRoute.snapshot.paramMap.get('route');
  }

  /**
   * Register user
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
        await this.getGeolocation();
        if (this.registerForm.get('password')?.value !== this.registerForm.get('retypePassword')?.value) {
          this.loadingService.hideLoading();
          this.alertService.infoAlert('Los passwords ingresados no son iguales.');
          return;
        }
        if (this.latitude === null || this.longitude === null) {
          this.loadingService.hideLoading();
          this.alertService.infoAlert('Active el GPS e intente de nuevo.');
          return;
        }
        const registerForm: IRegister = {
          name: this.registerForm.get('name')?.value,
          email: this.registerForm.get('email')?.value,
          picture: null,
          role: Role.USER,
          hasPet: false,
          city: this.nativeGeocoderResult ? this.nativeGeocoderResult.administrativeArea : null,
          locality: this.nativeGeocoderResult ? this.nativeGeocoderResult.locality : null,
        }

        const userRegister = await this.authService.register(registerForm);
        console.log(userRegister);

        await this.notificationService.setOneSignalExternalId(userRegister._id);
        await this.firebaseService.RegisterUser(this.registerForm.get('email')?.value, this.registerForm.get('password')?.value);
        await this.firebaseService.SendVerificationMail();
        this.registerForm.reset();
        this.alertService.presentToast('Se ha registrado exitosamente.').then(() => {
          this.goToMainPage();
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
   * Go to main page
   */
  goToMainPage() {
    this.navCtrl.navigateForward(['main-tab/verify-email']);
  }

  checkboxClick() {
    this.checkedActive = !this.checkedActive;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async getGeolocation() {
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location === 'granted') {
        const coordinates = await Geolocation.getCurrentPosition();
        console.log(coordinates);

        this.latitude = coordinates.coords.latitude;
        this.longitude = coordinates.coords.longitude;

        await this.nativeGeocoder.reverseGeocode(this.latitude, this.longitude, this.options)
          .then((result: NativeGeocoderResult[]) => {
            this.nativeGeocoderResult = result[0]
            console.log(this.nativeGeocoderResult);

          })
          .catch((error: any) => console.log(error));
      } else {
        console.error('Location permission not granted');
      }
    } catch (error) {
      console.error('Error getting location', error);
      this.alertService.infoAlert('Ocurrio un error al obtener la ubicación.');
    }
  }
}
