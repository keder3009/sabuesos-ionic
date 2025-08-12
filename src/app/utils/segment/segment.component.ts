import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { ReportService } from 'src/app/services/report.service';
import { IAdReport, IReport } from 'src/app/shared/types/report.interface';
import { AdmobService } from "src/app/services/admod.service";
import { ResponseInitNativeAdss } from 'capacitor-admob-keder';


@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
})
export class SegmentComponent implements OnInit {
  @Input() reportList: IAdReport[] = [];
  @Input() activedSegment: number;
  @Output() optionSelected: EventEmitter<any> = new EventEmitter();
  public typeReportList: number;
  public showData = false;
  public adDataList: ResponseInitNativeAdss[] = [];

  constructor(private reportService: ReportService, private loadingService: LoadingService, private changeDetectorRef: ChangeDetectorRef, private admobService: AdmobService) {
  }

  async ngOnInit() {
    this.admobService.nativeAds$.subscribe(ads => {
      if (ads) this.adDataList = ads;
    });
  }

  async ionViewWillEnter() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.changeDetectorRef.detectChanges();
    if (changes['reportList']?.currentValue) {
      this.showData = true;
      this.typeReportList = this.activedSegment;
    } else {
      this.showData = false;
    }
  }

  /**
   * check if segment is change
   * @param event
   */
  segmentChanged(event: any) {
    this.activedSegment = event.detail.value;
    this.typeReportList = event.detail.value;
  }

  // async handleRefresh(event: any) {
  //   setTimeout(async () => {
  //     this.reportList = await this.reportService.getReports().toPromise();
  //     event.target.complete();
  //   }, 4000);
  // }

  async handleRefresh(event: any) {
    setTimeout(async () => {
      try {
        const reports = await this.reportService.getReports().toPromise();
        this.reportList = reports;
        event.target.complete();
      } catch (error) {
        console.error('Error al refrescar los reportes:', error);
        event.target.complete();
      }
    }, 4000);
  }


  async openAd(slide: any) {
    if (!slide.id) return this.openLink(slide);
    try {
      await this.admobService.openAd(slide.id);
    } catch (error) {
      console.error('Error al abrir el anuncio:', error)

    }
  }

  openLink(slide: any) {
    if (slide.link) window.open(slide.link, '_blank');
  }
}
