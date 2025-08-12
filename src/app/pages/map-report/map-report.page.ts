import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { ReportService } from 'src/app/services/report.service';
import { IReport } from 'src/app/shared/types/report.interface';

@Component({
  selector: 'app-map-report',
  templateUrl: './map-report.page.html',
  styleUrls: ['./map-report.page.scss'],
})
export class MapReportPage {
  public typeReport: number;
  public latitude: number;
  public longitude: number;
  public id: string;
  public reportInfo: IReport;

  constructor(private activatedRoute: ActivatedRoute, private reportService: ReportService,
    private alertService: AlertService) { }

  async ionViewWillEnter() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.reportInfo = await this.reportService.getReportById(this.id);
      this.latitude = this.reportInfo.latitude;
      this.longitude = this.reportInfo.longitude;
      this.typeReport = this.reportInfo.typePost;
    }
  }

  async newCoords(event) {
    try {
      this.reportInfo.latitude = event.latitude;
      this.reportInfo.longitude = event.longitude;
      await this.reportService.updateReport(this.reportInfo._id, this.reportInfo);
    } catch (error) {
      console.error(error);
      this.alertService.infoAlert('Error obteniendo la nueva direccion de reporte. Intente nuevamente');
    }
  }
}
