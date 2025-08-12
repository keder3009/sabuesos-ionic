import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin } from 'src/app/pages/login/types/login.interface';
import { IRegister } from 'src/app/pages/register/types/register-form.interface';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { FirebaseService } from './firebase.service';
import { Router } from '@angular/router';
import { IUser } from '../shared/types/user.interface';
import { AlertService } from './alert.service';
import { IEntity } from '../shared/types/entity.interface';
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _baseUrl = environment.api + '/auth';
  public activeUserName = '';
  public isLogged = this.firebaseService.isLoggedIn;

  constructor(
    private http: HttpClient,
    private storage: Storage, public navCtrl: NavController, private alertService: AlertService,
    public firebaseService: FirebaseService, private router: Router,
    private notificationService: NotificationService
  ) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  public async register(
    registerForm: IRegister
  ): Promise<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS']);
    return await this.http
      .post<IRegister>(`${this._baseUrl}/signup`, registerForm, { headers })
      .toPromise();
  }

  public async verifyIfEmailExist(email: string): Promise<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .get<IUser>(`${this._baseUrl}/checkemail/${email}`, { headers })
      .toPromise();
  }

  public async registerOrganization(
    registerOrganization: IEntity
  ): Promise<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .post<IEntity>(`${this._baseUrl}/signup`, registerOrganization, { headers })
      .toPromise();
  }

  public async login(
    loginForm: ILogin
  ): Promise<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .post<ILogin>(`${this._baseUrl}/signin`, loginForm, { headers })
      .toPromise();
  }

  public async getRoleUserActive() {
    return await this.firebaseService.userRole;
  }

  public async getUserActive() {
    return await this.firebaseService.userEmail;
  }

  public async getUser() {
    return await this.firebaseService.user;
  }

  public async getNameUserActive() {
    return await this.firebaseService.nameUserActive;
  }

  async getHeadersJson() {
    const token = '';
    let headers = await new HttpHeaders({
      'Authorization': token
    });
    await headers.append('Content-Type', 'application/json');
    return headers;
  }

  public async logout() {
    await this.firebaseService.SignOut();
    this.activeUserName = this.firebaseService.nameUserActive;
    this.isLogged = await this.firebaseService.isLoggedIn;
    localStorage.clear();
  }

  async isLoggedIn() {
    return this.firebaseService.isLoggedIn;
  }

}
