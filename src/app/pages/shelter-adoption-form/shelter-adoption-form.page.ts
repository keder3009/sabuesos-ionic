import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { IShelterAnimal } from 'src/app/shared/types/shelter-animal.interface';

@Component({
  selector: 'app-shelter-adoption-form',
  templateUrl: './shelter-adoption-form.page.html',
  styleUrls: ['./shelter-adoption-form.page.scss'],
})
export class ShelterAdoptionFormPage implements OnInit {
  public animal: IShelterAnimal;
  
  // Form fields
  public name = '';
  public email = '';
  public mobile = '';
  public birthdate = '';

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    // Get animal from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['animal']) {
      this.animal = navigation.extras.state['animal'];
    } else if (history.state?.animal) {
      this.animal = history.state.animal;
    }

    if (!this.animal) {
      this.alertService.infoAlert('No se pudo cargar la información de la mascota.');
      this.goBack();
    }
  }

  /**
   * Validate form
   */
  isFormValid(): boolean {
    return !!(this.name && this.email && this.mobile && this.birthdate);
  }

  /**
   * Submit adoption form
   */
  submitAdoption() {
    if (!this.isFormValid()) {
      this.alertService.infoAlert('Por favor completa todos los campos.');
      return;
    }

    try {
      const baseUrl = 'https://sabuesos.com.co';
      const animalId = this.animal.id;
      
      // Prepare payload
      const payload = {
        name: this.name,
        email: this.email,
        mobile: this.mobile,
        birthdate: this.birthdate
      };

      // Convert to Base64
      const json = JSON.stringify(payload);
      const b64 = btoa(unescape(encodeURIComponent(json))); // UTF-8 safe
      
      // Build URL
      const url = `${baseUrl}/webapp/${animalId}/${encodeURIComponent(b64)}`;
      
      // Open in external browser
      window.open(url, '_blank');
      
      // Go back to list
      this.goBack();
    } catch (error) {
      console.error('Error al procesar adopción:', error);
      this.alertService.infoAlert('Ocurrió un error al procesar la solicitud.');
    }
  }

  /**
   * Go back
   */
  goBack() {
    this.navCtrl.back();
  }
}
