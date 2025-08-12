import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ISupport } from '../shared/types/support.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  private _baseUrl = environment.api + '/support';

  constructor(private http: HttpClient, private authService: AuthService) { }

  async getSupports(): Promise<ISupport[]> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .get<ISupport[]>(`${this._baseUrl}`, { headers })
      .toPromise();
  }
  async updateSupport(id: string, userForm: ISupport): Promise<ISupport> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .put<ISupport>(`${this._baseUrl}/${id}`, userForm, { headers })
      .toPromise();
  }

  async deleteSupport(id: string): Promise<ISupport> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .delete<ISupport>(`${this._baseUrl}/${id}`, { headers })
      .toPromise();
  }

  async createSupport(supportForm: ISupport) {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .post<ISupport>(`${this._baseUrl}`, supportForm, { headers })
      .toPromise();
  }

}
