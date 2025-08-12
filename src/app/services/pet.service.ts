import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPet } from 'src/app/shared/types/pet.interface';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PetService {

  private _baseUrl = environment.api + '/pet';

  constructor(private http: HttpClient, private authService: AuthService) { }

  async getPets(): Promise<IPet[]> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .get<IPet[]>(`${this._baseUrl}`, { headers }).toPromise();
  }

  async getPetById(id: string): Promise<IPet> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .get<IPet>(`${this._baseUrl}/${id}`, { headers })
      .toPromise();
  }

  async getPetByIdUser(id: string): Promise<IPet> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .get<IPet>(`${this._baseUrl}/findPetByUserId/${id}`, { headers })
      .toPromise();
  }

  async updatePet(id: string, userForm: IPet): Promise<IPet> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .put<IPet>(`${this._baseUrl}/${id}`, userForm, { headers })
      .toPromise();
  }

  async deletePet(id: string): Promise<IPet> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .delete<IPet>(`${this._baseUrl}/${id}`, { headers })
      .toPromise();
  }

  async createPet(userForm: IPet) {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .post<IPet>(`${this._baseUrl}/`, userForm, { headers })
      .toPromise();
  }

  async addUser(petId: string, id: string) {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .post<IPet>(`${this._baseUrl}/${petId}/user/${id}`, { headers })
      .toPromise();
  }

}
