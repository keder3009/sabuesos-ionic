import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private alertController: AlertController,
    private toastController: ToastController) { }


    async infoAlert(message: string, buttonLabel?: string, onOk?: () => void) {
      const alert = await this.alertController.create({
        message,
        buttons: [
          {
            text: buttonLabel || 'OK',
            handler: () => {
              if (onOk) {
                onOk();
              }
            }
          }
        ]
      });

      await alert.present();
    }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  async confirmAlert(
  title: string, 
  message: string, 
  confirmText: string = 'Confirmar', 
  cancelText: string = 'Cancelar'
): Promise<boolean> {
  return new Promise(async (resolve) => {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
          handler: () => resolve(false)
        },
        {
          text: confirmText,
          handler: () => resolve(true)
        }
      ]
    });
    await alert.present();
  });
}

}
