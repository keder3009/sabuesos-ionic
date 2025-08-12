import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from 'src/app/shared/types/user.interface';
import { environment } from 'src/environments/environment';
import { IEntity } from '../shared/types/entity.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _baseUrl = environment.api + '/user';

  constructor(private http: HttpClient, private authService: AuthService) { }

  async getUsers(): Promise<IUser[]> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .get<IUser[]>(`${this._baseUrl}`, { headers })
      .toPromise();
  }

  async getUserByEmail(email: string): Promise<IUser> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    const data = await this.http
      .get<IUser>(`${this._baseUrl}/${email}`, { headers })
      .toPromise();


    if (data) localStorage.setItem('userData', JSON.stringify(data));
    return data
  }

  async updateUser(id: string, userForm: IUser): Promise<IUser> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .put<IUser>(`${this._baseUrl}/${id}`, userForm, { headers })
      .toPromise();
  }

  async deleteUser(id: string): Promise<IUser> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .delete<IUser>(`${this._baseUrl}/delete_all_data/${id}`, { headers })
      .toPromise();
  }

  async createUser(userForm: IUser) {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .put<IUser>(`${this._baseUrl}/`, userForm, { headers })
      .toPromise();
  }

}
