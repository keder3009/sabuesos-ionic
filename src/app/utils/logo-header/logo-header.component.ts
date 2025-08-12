import { Component, OnInit } from '@angular/core';
import { CitiesService, ICities } from 'src/app/services/cities.service';

@Component({
  selector: 'app-logo-header',
  templateUrl: './logo-header.component.html',
  styleUrls: ['./logo-header.component.scss'],
})
export class LogoHeaderComponent implements OnInit {
  public countriesSelector: ICities[] = [];

  constructor(private citiesService: CitiesService) { }

  async ngOnInit() {
    this.countriesSelector = await this.citiesService.getCities();
  }
}
