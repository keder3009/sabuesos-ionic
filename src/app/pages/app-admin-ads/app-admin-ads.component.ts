import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { IAdvertisement } from '../../shared/types/advertisement.interface';
import { AdvertisementService } from '../../services/advertisement.service';
import { CreateAdModalComponent } from './create-ad-modal/create-ad-modal.component';

@Component({
  selector: 'app-admin-ads',
  templateUrl: './app-admin-ads.component.html', // ← Corregir ruta
  styleUrls: ['./app-admin-ads.component.scss'] // ← Corregir ruta
})
export class AppAdminAdsComponent implements OnInit { // ← Cambiar nombre de clase

  advertisements$: Observable<IAdvertisement[]>;

  constructor(
    private adService: AdvertisementService,
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadAdvertisements();
  }

  loadAdvertisements() {
    this.advertisements$ = this.adService.getAdvertisements();
    console.log(this.advertisements$);
    
  }

  async openCreateModal() {
    const modal = await this.modalController.create({
      component: CreateAdModalComponent,
      cssClass: 'create-ad-modal'
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && (result.data.created || result.data.updated)) {
        this.loadAdvertisements();
      }
    });

    return await modal.present();
  }

  async editAdvertisement(ad: IAdvertisement) {
    const modal = await this.modalController.create({
      component: CreateAdModalComponent,
      componentProps: {
        advertisement: ad,
        isEdit: true
      },
      cssClass: 'create-ad-modal'
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.updated) {
        this.loadAdvertisements();
      }
    });

    return await modal.present();
  }

  async toggleAdStatus(ad: IAdvertisement) {
    const loading = await this.loadingController.create({
      message: ad.active ? 'Desactivando...' : 'Activando...'
    });
    await loading.present();

    try {
      await this.adService.toggleAdvertisementStatus(ad.id, !ad.active);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    } finally {
      loading.dismiss();
    }
  }

  async deleteAdvertisement(ad: IAdvertisement) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar "${ad.title || 'esta publicidad'}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando...'
            });
            await loading.present();

            try {
              await this.adService.deleteAdvertisement(ad.id, ad.mediaUrl);
            } catch (error) {
              console.error('Error al eliminar:', error);
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'success' : 'medium';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Activa' : 'Inactiva';
  }
}