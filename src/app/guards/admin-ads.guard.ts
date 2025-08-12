import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthAdminService } from '../services/auth-admin.service';
import { AlertController } from '@ionic/angular';

export const adminAdsGuard: CanActivateFn = async (route, state) => {
  const authAdminService = inject(AuthAdminService);
  const router = inject(Router);
  const alertController = inject(AlertController);

  const canAccess = await authAdminService.canManageAdsAsync();
  
  if (!canAccess) {
    const alert = await alertController.create({
      header: 'Acceso Denegado',
      message: 'No tienes permisos para acceder a la administración de publicidad.',
      buttons: [{
        text: 'OK',
        handler: () => {
          router.navigate(['main-tab/list-reports']);
        }
      }]
    });
    await alert.present();
    return false;
  }
  
  return true;
};