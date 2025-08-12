import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor(public loadingController: LoadingController) { }

  async showLoading(section?: string) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'custom-loading',
    }).then(a => {
      a.present().then(() => {
        console.info('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.info('abort presenting'));
        }
      });
    });
  }

  async hideLoading(section?: string) {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.info('dismissed'));
  }

  async temporayLoading(duration: number) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Cargando...',
      duration: duration,
      cssClass: 'custom-loading',
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.info('abort presenting'));
        }
      });
    });
  }

}
