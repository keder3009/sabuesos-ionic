import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.page.html',
  styleUrls: ['./auth-page.page.scss'],
})
export class AuthPagePage implements OnInit {

  constructor(private navCtrl: NavController, private router: Router) { }

  ngOnInit() {
  }

  goToRegister() {
    this.navCtrl.navigateRoot(['/main-tab/register', this.router.url], { replaceUrl: true });
  }

  goToLogin() {
    this.navCtrl.navigateRoot(['/main-tab/login', this.router.url], { replaceUrl: true });
  }

  goToOrganizationForm() {
    this.navCtrl.navigateRoot(['/main-tab/organization-form', this.router.url], { replaceUrl: true });
  }

}
