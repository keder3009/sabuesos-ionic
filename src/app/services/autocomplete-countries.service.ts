import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteCountriesService {
  private countries: any[] = [];

  constructor(private http: HttpClient) { }

  getResults(keyword: string): Observable<any[]> {
    let observable: Observable<any>;

    if (this.countries.length === 0) {
      observable = this.http.get('https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json');
    } else {
      observable = of(this.countries);
    }
    return observable.pipe(
      map((result: any) => {
        return result.filter((item: any) => {
          return item.departamento.toLowerCase().startsWith(keyword.toLowerCase());
        });
      })
    );
  }
}
