import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from 'src/app/shared/types/user.interface';
import { environment } from 'src/environments/environment';
import { IEntity } from '../shared/types/entity.interface';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class EntityService {
    private _baseUrl = environment.api + '/entity';

    constructor(private http: HttpClient, private authService: AuthService) { }

    async getEntities(): Promise<IEntity[]> {
        let headers = new HttpHeaders();
        await headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
        return await this.http
            .get<IEntity[]>(`${this._baseUrl}`, { headers })
            .toPromise();
    }
    async updateEntity(id: string, entityForm: IEntity): Promise<IEntity> {
        let headers = new HttpHeaders();
        await headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
        return await this.http
            .put<IEntity>(`${this._baseUrl}/${id}`, entityForm, { headers })
            .toPromise();
    }

    async deleteEntity(id: string): Promise<IEntity> {
        let headers = new HttpHeaders();
        await headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
        return await this.http
            .delete<IEntity>(`${this._baseUrl}/${id}`, { headers })
            .toPromise();
    }

    async createEntity(entityForm: IEntity) {
        let headers = new HttpHeaders();
        await headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
        return await this.http
            .put<IEntity>(`${this._baseUrl}/`, entityForm, { headers })
            .toPromise();
    }

    async getEntityByEmail(email: string): Promise<IEntity> {
        let headers = new HttpHeaders();
        await headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
        return await this.http
            .get<IEntity>(`${this._baseUrl}/${email}`, { headers })
            .toPromise();
    }
}
