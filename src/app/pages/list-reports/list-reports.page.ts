import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AutocompleteCountriesService } from 'src/app/services/autocomplete-countries.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ReportService } from 'src/app/services/report.service';
import { IReport, IAdReport } from 'src/app/shared/types/report.interface';
import { AdmobService } from "src/app/services/admod.service";
import { ResponseInitNativeAdss } from "capacitor-admob-keder";

@Component({
  selector: 'app-list-reports',
  templateUrl: './list-reports.page.html',
  styleUrls: ['./list-reports.page.scss'],
})
export class ListReportsPage implements OnInit {
  optionsSegment = 'list-report';
  public reportList: IAdReport[] = [];
  // private id: string;
  public activedSegment = 0;
  public showBackButton = false;
  public nativeAds: ResponseInitNativeAdss[] = [];

  constructor(
    public autocompleteCountriesService: AutocompleteCountriesService, private alertService: AlertService,
    private reportService: ReportService, private loadingService: LoadingService,
    private activatedRoute: ActivatedRoute, private router: Router, private admobService: AdmobService
  ) { }


  ngOnInit(): void {
    this.getOptionRoute();
    this.admobService.nativeAds$.subscribe(ads => {
      if (ads) this.nativeAds = ads;
      if(this.nativeAds.length > 0) this.addList();
    });
  }

  async ionViewWillEnter() {
    await this.getReportList()
  }

  optionSelected(event: any) {
  }

  /**
   * get ReportList
   */
  async getReportList() {
    try {
      this.getOptionRoute();
      const reports = await this.reportService.getReports().toPromise();
      this.reportList = reports;
      this.addList();
      this.loadingService.hideLoading();
    } catch (error) {
      this.loadingService.hideLoading();
      console.error(error);
      this.alertService.infoAlert("Ocurrió un error al intentar obtener la información.");
    }
  }

  addList() {
    let adIndex = 0;
    let finalList: IAdReport[] = [];

    console.log("kevin",this.nativeAds);
    
    this.reportList.forEach((report, index) => {
      finalList.push(report);

      if ((index + 1) % 2 === 0 && this.nativeAds.length > 0) {
        let adData = this.nativeAds[adIndex % this.nativeAds.length];
        finalList.push({ isAd: true, ...adData } as unknown as IAdReport);
        adIndex++;
      }
    });

    this.reportList = finalList;
  }

  getOptionRoute() {
    switch (this.router.url) {
      case '/main-tab/extravied':
        this.activedSegment = 0;
        break;
      case '/main-tab/finded':
        this.activedSegment = 1;
        break
      case '/main-tab/adoptions-list':
        this.activedSegment = 2;
        break
      case '/main-tab/services':
        this.activedSegment = 3;
        break
      default:
        this.activedSegment = 0;
        break;
    }
  }
}
