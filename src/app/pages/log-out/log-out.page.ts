import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.page.html',
  styleUrls: ['./log-out.page.scss'],
})
export class LogOutPage implements OnInit {

  constructor(private authService: AuthService, public navCtrl: NavController) {
  }

  async ngOnInit() {
    await this.authService.logout();
    this.navCtrl.navigateRoot(['main-tab/list-reports']);
  }

  async ionViewWillEnter() {
    await this.authService.logout();
    this.navCtrl.navigateRoot(['main-tab/list-reports']);
  }
}
