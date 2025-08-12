import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IReport } from 'src/app/shared/types/report.interface';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() data: IReport;
  constructor(public navCtrl: NavController, private router: Router) { }

  async ngOnInit() {
  }

  /**
   * Go to report page
   * @param data 
   */
  goReport(data: IReport) {
    this.navCtrl.navigateRoot(['main-tab/view-report', data._id, this.router.url], { replaceUrl: true });
  }
}
