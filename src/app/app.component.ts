import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { APP_PAGES, APP_PAGES_LOGGED } from 'src/app/constants/tab-pages';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';
import { NotificationService } from './services/notification.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { AdmobService } from './services/admod.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthAdminService } from './services/auth-admin.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: any[] = APP_PAGES.filter((page) => page.inSidemenu);
  public appPagesLogged$: Observable<any[]>;
  private authorizedPagesSubject = new BehaviorSubject<any[]>([]);
  private platformName: string = '';

  constructor(
    public platform: Platform,
    private notificationService: NotificationService,
    public authService: AuthService,
    public firebaseService: FirebaseService,
    private router: Router,
    private admobService: AdmobService,
    private authAdminService: AuthAdminService

  ) {
    this.initializeApp();
    this.setupAuthListener();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      SplashScreen.hide();
      this.notificationService.initialConfiguration();
      this.admobService.initialize();
      this.platform.backButton.subscribeWithPriority(10, () => {
        if (this.router.url === '/home') {
          navigator['app'].exitApp();
        } else {
          this.router.navigate(['../']);
        }
      });
    });
  }

    private setupAuthListener() {
    this.firebaseService.ngFireAuth.authState.subscribe(user => {
      if (user) {
        console.log('Usuario autenticado, inicializando páginas...');
        this.initializePages();
      } else {
        console.log('Usuario no autenticado, limpiando páginas...');
        this.authorizedPagesSubject.next([]);
      }
    });
  }

  private async initializePages() {
    if (this.platform.is('ios')) {
      this.platformName = 'ios';
    } else if (this.platform.is('android')) {
      this.platformName = 'android';
    } else {
      this.platformName = 'web';
    }
    const canManageAds = await this.authAdminService.canManageAdsAsync();

    const filteredPages = APP_PAGES_LOGGED.filter(page => {
      if (!page.inSidemenu) return false;
      if (page.requiresAdminAuth) return canManageAds;
      if (page.showAndroid) return this.platformName === "android";
      return true;
    });

    this.authorizedPagesSubject.next(filteredPages);

    this.appPagesLogged$ = this.authorizedPagesSubject.asObservable();
  }

  public async refreshPages() {
    await this.initializePages();
  }
}
