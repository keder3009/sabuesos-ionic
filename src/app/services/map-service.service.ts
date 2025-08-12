import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MapBoxOutput } from 'src/app/interfaces/map.interface';
import { environment } from 'src/environments/environment';

declare var mapboxgl: any;
@Injectable({
  providedIn: 'root',
})
export class MapServiceService {
  constructor(private http: HttpClient) { }

  search_word(query: string) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http
      .get(
        url +
        query +
        '.json?types=address&access_token=' +
        environment.mapboxgl.accessToken
      )
      .pipe(
        map((res: MapBoxOutput) => {
          return res.features;
        })
      );
  }
}
