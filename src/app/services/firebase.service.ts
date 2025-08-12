import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { UserFirebase } from '../shared/types/user-firebase';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {
  FacebookLogin
} from '@capacitor-community/facebook-login';
import { AlertService } from './alert.service';
import { Role } from '../shared/types/role.interface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { UtilsService } from './utils.service';
import { SignInWithApple, SignInWithAppleOptions } from '@capacitor-community/apple-sign-in';
import { sha256 } from 'js-sha256';
import { LoadingService } from 'src/app/services/loading.service';
import { Capacitor } from '@capacitor/core';

const FACEBOOK_PERMISSIONS = [
  'email',
  'public_profile'
];

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  userData: any;
  private minNumber = 100000000;
  private maxNumber = 999999999;

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public fireStorage: AngularFireStorage,
    public router: Router,
    public ngZone: NgZone,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private utilService: UtilsService,
  ) {
    this.ngFireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        let storedUser = localStorage.getItem('user');
        if (storedUser) {
          JSON.parse(storedUser);
        }
      } else {
        localStorage.removeItem('user');
      }
    });
    try {
      GoogleAuth.initialize({
        clientId: '909651562334-o2jsv9m3sdpkq11ng034bfsh2m7b5fb1.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
      console.log('GoogleAuth initialized successfully');
    } catch (error) {
      console.error('Error initializing GoogleAuth:', error);
    }
    this.inicializeFacebook();

  }

  async inicializeFacebook() {
    await FacebookLogin.initialize({ appId: '998695285332737' });
  }

  // Reload localStorage whit user info
  async reloadLocalStorage(): Promise<void> {
    const user = await this.ngFireAuth.currentUser;

    if (user) {
      this.userData = user;
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  // // Login in with email/password
  async SignIn(email: string, password: string) {
    return await this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }
  // Register user with email/password
  async RegisterUser(email: string, password: string) {
    return await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }
  // Email verification when new user register
  async SendVerificationMail(): Promise<any | void> {
    return await this.ngFireAuth.currentUser.then(async (user) => {
      if (user) {
        await user.sendEmailVerification();
        this.router.navigate(['main-tab/verify-email']);
      }
    });
  }
  // Recover password
  async PasswordRecover(passwordResetEmail: string) {
    return await this.ngFireAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.alertService.infoAlert('Se ha enviado un correo para resetear su contraseña');
      })
      .catch((error) => {
        this.alertService.infoAlert(error);
      });
  }
  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const userItem = localStorage.getItem('user');
    if (!userItem) {
      return false;
    }
    const user = JSON.parse(userItem);
    return user !== null && (user.emailVerified !== false ? true : false || (user.providerData[0]?.providerId === 'google.com' || user.providerData[0]?.providerId === 'facebook.com'));
  }

  // Returns user uuid
  get userUuid(): string {
    const user = JSON.parse(localStorage.getItem('user') || '');
    return user.uid;
  }

  // Return user email
  get userEmail(): string {
    const user = JSON.parse(localStorage.getItem('user') || '');
    return user.email;
  }

  // Return user email
  get user(): object {
    const data = localStorage.getItem('userData')
    if (!data) return null
    return JSON.parse(data);
  }

  // Return name user

  get nameUserActive(): any {
    return localStorage.getItem('name');
  }

  // Return user role
  get userRole(): any {
    return localStorage.getItem('role');
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    this.reloadLocalStorage();
    const user = JSON.parse(localStorage.getItem('user') || '' || '');
    return user.emailVerified !== false ? true : false;
  }

  async chargeUserInfoToStorage() {
    this.reloadLocalStorage();
    const user = JSON.parse(localStorage.getItem('user') || '' || '');
  }

  async GoogleAuth() {
    try {
      const res: any = await GoogleAuth.signIn();
      const idToken = res.idToken || res.authentication.idToken;
      const result = await this.ngFireAuth.signInWithCredential(auth.GoogleAuthProvider.credential(idToken));
      localStorage.setItem('role', Role.USER.toString());
      localStorage.setItem('name', result.user.displayName);
      await this.SetUserData(result.user);
      this.ngZone.run(() => {
        this.router.navigate(['main-tab/list-reports']);
      });
      return result;
    } catch (error) {
      console.error(error, 'aqui falla');
      return null;
    }
  }

  async AppleAuth() {
    const nonce = this.generateNonce();
    const options: SignInWithAppleOptions = {
      clientId: 'co.com.sabuesos.newapp',
      redirectURI: 'https://sabuesos-ae49b.firebaseapp.com/__/auth/handler',
      scopes: 'email name',
      state: 'state',
      nonce: sha256(nonce),
    };
    try {
      const provider = new auth.OAuthProvider('apple.com');
      const res: any = await SignInWithApple.authorize(options);
      const idToken = res.response.identityToken;
      const authorizationCode = res.response.authorizationCode;
      const credential = provider.credential({
        idToken,
        rawNonce: nonce,
        accessToken: authorizationCode,
      });
      const result = await this.ngFireAuth.signInWithCredential(credential);
      localStorage.setItem('role', Role.USER.toString());
      localStorage.setItem('name', result.user.displayName);
      await this.SetUserData(result.user);
      this.ngZone.run(() => {
        this.router.navigate(['main-tab/list-reports']);
      });
      return result;
    } catch (error) {
      console.error(error, 'aqui falla');
      return null;
    }
  }

  generateNonce(length: number = 32): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  }

  async FacebookAuth() {
    await this.loadingService.showLoading('facebook');
    if (!Capacitor.isNativePlatform()) {
      console.error('Facebook login solo funciona en dispositivos nativos (Android/iOS)');
      return false;
    }
    try {
      const result: any = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });

      if (result.accessToken) {
        const token = result.accessToken.token;
        const email = await this.getEmailFromFacebook(token);
        console.log('Email from Facebook:', email);

        const facebookCredential = auth.FacebookAuthProvider.credential(token);

        try {
          const firebaseResult = await this.ngFireAuth.signInWithCredential(facebookCredential);

          const user = JSON.parse(JSON.stringify(firebaseResult.user));
          user.email = email;
          localStorage.setItem('role', Role.USER.toString());
          localStorage.setItem('name', user.displayName || user.email);
          await this.SetUserData(user);
          return user;

        } catch (authError: any) {
          console.log('Auth error:', authError);
          if (authError.code === 'auth/account-exists-with-different-credential') {
            return await this.linkFacebookAccount(facebookCredential, email);
          } else {
            throw authError;
          }
        }
      } else {
        console.error('Facebook Login failed');
        return false;
      }
    } catch (error) {
      console.log(error, "Error en Facebook Auth");
      console.error(error.error);
      return false;
    }
  }

  private async linkFacebookAccount(facebookCredential: any, email: string) {
    try {
      console.log('🔵 Vinculando cuenta de Facebook con cuenta existente...');
      const signInMethods = await this.ngFireAuth.fetchSignInMethodsForEmail(email);
      console.log('Métodos de inicio disponibles:', signInMethods);
      let message = `Ya tienes una cuenta con el email ${email}.\n\nMétodos disponibles: ${signInMethods.join(', ')}`;
      this.loadingService.hideLoading();
      if (signInMethods.includes('google.com')) {
        message += '\n\n¿Quieres vincular tu cuenta de Facebook con Google?';

        const shouldLink = await this.alertService.confirmAlert(
          'Vincular Cuentas',
          message,
          'Vincular',
          'Cancelar'
        );

        if (shouldLink) {
          return await this.linkWithGoogle(facebookCredential);
        }
      } else if (signInMethods.includes('password')) {
        message += '\n\nDebes iniciar sesión con tu email y contraseña primero.';
        await this.alertService.infoAlert(message);
        this.router.navigate(['/main-tab/login']);
      }

      return false;
    } catch (error) {
      console.error('Error vinculando cuentas:', error);
      throw error;
    }
  }

  private async linkWithGoogle(facebookCredential: any) {
    try {
      const googleResult = await this.GoogleAuth();

      if (googleResult && googleResult.user) {
        const linkedResult = await googleResult.user.linkWithCredential(facebookCredential);

        await this.alertService.infoAlert('¡Cuentas vinculadas exitosamente!');

        const user = JSON.parse(JSON.stringify(linkedResult.user));
        localStorage.setItem('role', Role.USER.toString());
        localStorage.setItem('name', user.displayName || user.email);
        await this.SetUserData(user);
        await this.loadingService.showLoading('facebook');
        return user;
      }

      return false;
    } catch (error) {
      console.error('Error vinculando con Google:', error);
      throw error;
    }
  }

  async getEmailFromFacebook(accessToken: string): Promise<string | null> {
    try {
      const response = await fetch(`https://graph.facebook.com/me?fields=email&access_token=${accessToken}`);
      if (!response.ok) throw new Error('Failed to fetch user email from Facebook');
      const data = await response.json();
      return data && data.email ? data.email : null;
    } catch (error) {
      console.error('Error fetching email from Facebook:', error);
      return null;
    }
  }

  // Auth providers
  async AuthLogin(provider: any): Promise<any> {
    try {
      const result = await this.ngFireAuth
        .signInWithPopup(provider);
      localStorage.setItem('role', Role.USER.toString());
      await this.SetUserData(result.user);
      this.ngZone.run(() => {
        this.router.navigate(['main-tab/list-reports']);
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  // Store user in localStorage
  async SetUserData(user: any) {
    localStorage.setItem('email', JSON.stringify(user.email));
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${user.uid}`
    );
    const userData: UserFirebase = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return await userRef.set(userData, {
      merge: true,
    });
  }

  // Sign-out
  async SignOut() {
    try {
      try {
        await FacebookLogin.logout();
        console.log('Facebook logout exitoso');
      } catch (fbError) {
        console.log('Error en Facebook logout (puede ser normal):', fbError);
      }

      try {
        await GoogleAuth.signOut();
        console.log('Google logout exitoso');
      } catch (googleError) {
        console.log('Error en Google logout (puede ser normal):', googleError);
      }

      await this.ngFireAuth.signOut();

      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('userData');
      setTimeout(async () => {
        await this.reinitializePlugins();
      }, 500);

      this.router.navigate(['/main-tab/login']);

    } catch (error) {
      console.error('Error durante logout:', error);
      localStorage.clear();
      this.router.navigate(['/main-tab/login']);
    }
  }

  private async reinitializePlugins() {
    try {
      await FacebookLogin.initialize({ appId: '998695285332737' });
      console.log('Facebook reinicializado después de logout');

      await GoogleAuth.initialize({
        clientId: '909651562334-o2jsv9m3sdpkq11ng034bfsh2m7b5fb1.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
      console.log('Google reinicializado después de logout');

    } catch (error) {
      console.error('Error reinicializando plugins:', error);
    }
  }

  // get IdToken
  async getIdToken() {
    return (await this.ngFireAuth.currentUser).getIdToken(true).then((res) => {
    });
  }

  /**
   * UploadImage
   * @param img
   * @returns
   */
  async uploadImage(path: string, imgBlob: any): Promise<string> {
    const fileName = `sabuesos_${this.utilService.generateRandomNumber(this.minNumber, this.maxNumber)}`;
    const filePath = `${path}/${fileName}`;

    const ref = this.fireStorage.ref(filePath);

    const task = ref.put(imgBlob);
    return new Promise((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(async () => {
          try {
            const downloadURL = await ref.getDownloadURL().toPromise();
            console.log(downloadURL);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        })
      ).subscribe();
    });
  }

  async deleteFirebaseUser(user: any) {
    await user?.delete();
  }
}
