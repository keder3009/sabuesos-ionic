import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IShelterAnimal, IShelterAnimalsResponse } from '../shared/types/shelter-animal.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShelterAnimalService {
  private _baseUrl = 'https://api.sabuesos.com.co/public/animals';

  constructor(private http: HttpClient) {}
  // getShelterAnimals(page: number = 1, pageSize: number = 20, sort: string = 'createdAt', dir: string = 'desc'): Observable<IShelterAnimalsResponse> {
  getShelterAnimals(page: number = 1, pageSize: number = 20, sort: string = 'createdAt', dir: string = 'desc'): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS']);
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('q', '')
      .set('sort', sort)
      .set('dir', dir)
      .set('includeInAdoption', 'false');

    return this.http.get<IShelterAnimalsResponse>(`${this._baseUrl}`, { headers, params });
  }
}
