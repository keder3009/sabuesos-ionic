import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPet } from 'src/app/shared/types/pet.interface';
import { IAdReport, IReport } from 'src/app/shared/types/report.interface';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root',
})
export class ReportService {
  public headers: any;
  private _baseUrl = environment.api + '/post';

  constructor(private http: HttpClient, private authService: AuthService, private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  getReports(): Observable<IAdReport[]> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return this.http
      .get<IAdReport[]>(`${this._baseUrl}`, { headers })
  }

  async getReportById(id: string): Promise<IReport> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .get<IReport>(`${this._baseUrl}/${id}`, { headers })
      .toPromise();
  }

  getReportsByUser(email: string): Observable<IAdReport[]> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return this.http
      .get<IAdReport[]>(`${this._baseUrl}/findReportsByUser/${email}`, { headers })
  }

  getReportsByEntity(email: string): Observable<IAdReport[]> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return this.http
      .get<IAdReport[]>(`${this._baseUrl}/findReportsByEntity/${email}`, { headers })
  }

  async updateReport(id: string, reportForm: IReport): Promise<IReport> {

    console.log(reportForm, 'reportFom');
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .put<IReport>(`${this._baseUrl}/${id}`, reportForm, { headers })
      .toPromise();
  }

  async deleteReport(id: string): Promise<IReport> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .delete<IReport>(`${this._baseUrl}/${id}`, { headers })
      .toPromise();
  }

  async createReport(reportForm: IReport) {
    console.log(reportForm, 'report');
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .post<IReport>(`${this._baseUrl}/`, reportForm, { headers })
      .toPromise();
  }

  async addPet(postId: string, petId: string) {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .post<IPet>(`${this._baseUrl}/${postId}/pet/${petId}`, { headers })
      .toPromise();
  }

  async addFavoriteUser(postId: string, userId: string) {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .post<IPet>(`${this._baseUrl}/${postId}/favoriteUser/${userId}`, { headers })
      .toPromise();
  }

  async addFavoriteEntity(postId: string, entityId: string) {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .post<IPet>(`${this._baseUrl}/${postId}/favoriteEntity/${entityId}`, { headers })
      .toPromise();
  }


  async getFavoritiesByIdUser(idUser: string): Promise<IReport[]> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .get<IReport[]>(`${this._baseUrl}/findFavoritiesByUserId/${idUser}`, { headers }).toPromise();
  }

  async getFavoritiesByIdEntity(idEntity: string): Promise<IReport[]> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .get<IReport[]>(`${this._baseUrl}/findFavoritiesByEntityId/${idEntity}`, { headers }).toPromise();
  }

}

