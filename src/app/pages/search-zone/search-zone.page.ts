import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { Coordinates } from 'src/app/shared/types/coordinates.interface';
import { IReport } from 'src/app/shared/types/report.interface';
import { lastValueFrom } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { ActivatedRoute, Route } from '@angular/router';


@Component({
  selector: 'app-search-zone',
  templateUrl: './search-zone.page.html',
  styleUrls: ['./search-zone.page.scss'],
})
export class SearchZonePage implements OnInit {
  public reportInfo: IReport[] = [];
  public coords: Coordinates[] = [];
  public reports: IReport[] = [];
  public latitude: number = null;
  public longitude: number = null;

  constructor(private reportService: ReportService, private geolocation: Geolocation,) { }

  async ngOnInit() {
    this.reports = await lastValueFrom(this.reportService.getReports());
    await this.getGeolocation();
  }

  public async getGeolocation() {
    const permission = await Geolocation.requestPermissions();
    if (permission.location === 'granted') {
      const coordinates = await Geolocation.getCurrentPosition();
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
    } else {
      console.error('Location permission not granted');
    }
  }

  async ionViewWillEnter() {
    this.reports = await lastValueFrom(this.reportService.getReports());
    await this.getGeolocation();
  }
}
