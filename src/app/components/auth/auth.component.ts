import { Component, OnInit } from '@angular/core';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { IRegister } from 'src/app/pages/register/types/register-form.interface';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Role } from 'src/app/shared/types/role.interface';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  public latitude: any = null;
  public longitude: any = null;
  public platformName: string = '';
  public nativeGeocoderResult: NativeGeocoderResult | null = null;
  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };


  constructor(private loadingService: LoadingService, private alertService: AlertService, private firebaseService: FirebaseService, private authService: AuthService, private notificationService: NotificationService, private nativeGeocoder: NativeGeocoder, private router: Router, private navCtrl: NavController, public platform: Platform) { }

  ngOnInit() {
    if (this.platform.is('ios')) {
      this.platformName = 'ios';
    } else if (this.platform.is('android')) {
      this.platformName = 'android';
    } else {
      this.platformName = 'web';
    }
  }

  goToLogin() {
    this.navCtrl.navigateRoot(['/main-tab/login', this.router.url], { replaceUrl: true });
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

  async registerWithFacebook() {
    try {
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

  async registerUser(user: any) {
    try {
      await this.getGeolocation();
      console.log(JSON.stringify(user), "kevin");
      
      const userExist = await this.authService.verifyIfEmailExist(user.email);
      console.log(userExist, "kevin userExist");
      
      if (!userExist) {
        const registerForm: IRegister = {
          name: user.displayName ? user.displayName : user.email,
          email: user.email,
          picture: null,
          role: Role.USER,
          hasPet: false,
          city: this.nativeGeocoderResult ? this.nativeGeocoderResult.administrativeArea : null,
          locality: this.nativeGeocoderResult ? this.nativeGeocoderResult.locality : null,
        };
        console.log(JSON.stringify(registerForm), "kevin registerForm");
        
        const userRegister = await this.authService.register(registerForm);
        console.log(userRegister, "kevin userRegister");
        
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

  async goToPage() {
    this.firebaseService.reloadLocalStorage();
    this.authService.isLogged = this.firebaseService.isLoggedIn;
    this.authService.activeUserName = await this.firebaseService.nameUserActive;
    this.router.navigateByUrl('main-tab/list-reports');
  }

}
