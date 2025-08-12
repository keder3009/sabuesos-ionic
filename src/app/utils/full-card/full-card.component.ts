import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IReport } from 'src/app/shared/types/report.interface';

@Component({
  selector: 'app-full-card',
  templateUrl: './full-card.component.html',
  styleUrls: ['./full-card.component.scss'],
})
export class FullCardComponent implements OnInit {
  @Input() data: IReport;

  constructor(public navCtrl: NavController, private router: Router) { }

  async ngOnInit() {
  }

  goReport(event: any) {
    this.navCtrl.navigateRoot(['main-tab/view-report', this.data._id, this.router.url], { replaceUrl: true });
  }
}
