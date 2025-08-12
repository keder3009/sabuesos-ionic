import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { IRegister } from '../register/types/register-form.interface';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AllValidationErrors, getFormValidationErrors, searchFormError } from 'src/app/shared/types/get-errors-form';
import { Role } from 'src/app/shared/types/role.interface';
import { ILogin } from './types/login.interface';
import { NotificationService } from "../../services/notification.service";
import { AdmobService } from "../../services/admod.service";
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public emailPattern: any =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public routePrevious: string | null;
  public latitude: any = null;
  public longitude: any = null;
  public nativeGeocoderResult: NativeGeocoderResult | null = null;
  public platformName: string = '';

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
    private firebaseService: FirebaseService,
    private router: Router,
    private admobService: AdmobService,
    public platform: Platform
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.pattern(this.emailPattern), Validators.required, Validators.maxLength(60)]],
      password: ['', [Validators.minLength(8), Validators.maxLength(20)]],
    })
  }

  async ngOnInit() {
    if (this.platform.is('ios')) {
      this.platformName = 'ios';
    } else if (this.platform.is('android')) {
      this.platformName = 'android';
    } else {
      this.platformName = 'web';
    }
    this.routePrevious = this.activatedRoute.snapshot.paramMap.get('route');
  }

  async ionViewWillEnter() {
    this.routePrevious = this.activatedRoute.snapshot.paramMap.get('route');
  }

  async onSubmit() {
    try {
      if (this.loginForm.valid) {
        this.loadingService.showLoading();
        await this.getGeolocation();
        if (this.latitude === null || this.longitude === null) {
          this.loadingService.hideLoading();
          this.alertService.infoAlert('Active el GPS e intente de nuevo.');
          return null;
        }
        const response = await this.firebaseService.SignIn(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)

        if (!response.user.emailVerified) {
          this.firebaseService.chargeUserInfoToStorage();
          this.loadingService.hideLoading();
          this.alertService.infoAlert('Email no verificado aún.');
          return false;
        }
        const loginForm: ILogin = {
          password: this.loginForm.get('password')?.value,
          email: this.loginForm.get('email')?.value,
        }
        const loginData: ILogin = await this.authService.login(loginForm);
        await this.notificationService.setOneSignalExternalId(loginData._id);
        this.loginForm.reset();
        this.loadingService.hideLoading();
        localStorage.setItem('role', loginData.role.toString());
        localStorage.setItem('name', loginData.name.toString());
        this.authService.getNameUserActive();
        this.alertService.presentToast('Ha ingresado exitosamente.');
        this.goToPage();
      } else {
        const errorForm: AllValidationErrors = getFormValidationErrors(
          this.loginForm.controls
        ).shift() as any;
        this.alertService.infoAlert(searchFormError(errorForm));
        return false;
      }
    } catch (error) {
      console.log(error);

      this.loadingService.hideLoading();
      this.alertService.infoAlert('Verifique su usuario y contraseña e intente nuevamente; si es una entidad verifique adicionalmente que se encuentre activa.');
      return false;
    }
    return true;
  }

  async registerWithGoogle() {
    try {
      await this.loadingService.showLoading();
      await this.getGeolocation();
      if (this.latitude === null || this.longitude === null) {
        this.loadingService.hideLoading();
        this.alertService.infoAlert('Active el GPS e intente de nuevo.');
        return;
      }
      const result: any = await this.firebaseService.GoogleAuth();
      await this.registerUser(result.user);
      await this.loadingService.hideLoading('google');
      this.goToPage();
      this.alertService.presentToast('Ha ingresado exitosamente.')
    } catch (error) {
      await this.loadingService.hideLoading();
      console.error(error);
      const messageError = 'Ocurrio un error al intentar registrarse. Verifique su método de ingreso, sus credenciales e inténtelo de nuevo.';
      await this.alertService.infoAlert(messageError);
    } finally {
      await this.loadingService.hideLoading();
    }
  }

  async registerWithApple() {
    try {
      await this.loadingService.showLoading();
      await this.getGeolocation();
      if (this.latitude === null || this.longitude === null) {
        this.loadingService.hideLoading();
        this.alertService.infoAlert('Active el GPS e intente de nuevo.');
        return;
      }
      const result: any = await this.firebaseService.AppleAuth();
      if (result) {
        await this.registerUser(result.user);
        await this.loadingService.hideLoading('apple');
        this.goToPage();
        this.alertService.presentToast('Ha ingresado exitosamente.');
      } else {
        throw new Error('Apple sign-in failed');
      }
    } catch (error) {
      await this.loadingService.hideLoading();
      console.error(error);
      const messageError = 'Ocurrió un error al intentar registrarse. Verifique su método de ingreso, sus credenciales e inténtelo de nuevo.';
      await this.alertService.infoAlert(messageError);
    } finally {
      await this.loadingService.hideLoading();
    }
  }

  async registerWithFacebook() {
    try {
      await this.loadingService.showLoading('facebook');
      await this.getGeolocation();
      if (this.latitude === null || this.longitude === null) {
        this.loadingService.hideLoading();
        this.alertService.infoAlert('Active el GPS e intente de nuevo.');
        return;
      }
      const user: any = await this.firebaseService.FacebookAuth();
      await this.registerUser(user);
      await this.loadingService.hideLoading('facebook');
      this.goToPage();
      this.alertService.presentToast('Ha ingresado exitosamente.')
    } catch (error) {
      await this.loadingService.hideLoading();
      const messageError = 'Ocurrio un error al intentar registrarse. Verifique su método de ingreso, sus credenciales e inténtelo de nuevo.';
      await this.alertService.infoAlert(messageError);
    }

  }

  async goToPage() {
    this.firebaseService.reloadLocalStorage();
    this.authService.isLogged = this.firebaseService.isLoggedIn;
    this.authService.activeUserName = await this.firebaseService.nameUserActive;
    this.router.navigateByUrl('main-tab/list-reports');
  }

  async registerUser(user: any) {
    try {
      await this.getGeolocation();
      const userExist = user?.email ? await this.authService.verifyIfEmailExist(user?.email) : false;
      if (!userExist) {
        const registerForm: IRegister = {
          name: user.displayName ? user.displayName : user?.email || user.givenName || "",
          email: user?.email || "",
          picture: null,
          role: Role.USER,
          hasPet: false,
          city: this.nativeGeocoderResult ? this.nativeGeocoderResult.administrativeArea : null,
          locality: this.nativeGeocoderResult ? this.nativeGeocoderResult.locality : null,
        };
        const userRegister = await this.authService.register(registerForm);
        await this.notificationService.setOneSignalExternalId(userRegister._id);
      } else {
        await this.notificationService.setOneSignalExternalId(userExist._id);
      }
    } catch (error) {
      await this.loadingService.hideLoading();
      console.error(error);
      await this.alertService.infoAlert('Ocurrio un error al intentar registrarse. Intentelo de nuevo.');
    }
  }

  public recoveryPassword() {
    this.navCtrl.navigateRoot(['/main-tab/recovery-password', this.router.url], { replaceUrl: true });
  }

  async getGeolocation() {
    try {
      console.log('Requesting location permissions...');
      const permission = await Geolocation.requestPermissions();
      console.log('Permission result:', permission);

      if (permission.location === 'granted') {
        console.log('Location permission granted. Getting current position...');
        const coordinates = await Geolocation.getCurrentPosition();
        console.log('Coordinates:', coordinates);

        this.latitude = coordinates.coords.latitude;
        this.longitude = coordinates.coords.longitude;

        console.log('Reversing geocode...');
        await this.nativeGeocoder.reverseGeocode(this.latitude, this.longitude, this.options)
          .then((result: NativeGeocoderResult[]) => {
            this.nativeGeocoderResult = result[0];
            console.log('Geocode result:', this.nativeGeocoderResult);
          })
          .catch((error: any) => {
            console.error('Error in reverse geocode:', error);
          });
      } else {
        console.error('Location permission not granted');
      }
    } catch (error) {
      console.error('Error getting location', error);
    }
  }
}
