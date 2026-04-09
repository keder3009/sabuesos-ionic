import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { IShelterAnimal } from 'src/app/shared/types/shelter-animal.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/shared/types/user.interface';
import { LoadingService } from 'src/app/services/loading.service';

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
    private alertService: AlertService,
    private authService: AuthService,
    private userService: UserService,
    private loadingService: LoadingService
  ) {}

  async ngOnInit() {
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
      return;
    }
    
    // Auto-llenar datos si hay sesión activa
    await this.loadUserData();
  }
  
  /**
   * Load user data if logged in
   */
  async loadUserData() {
    try {
      const isLoggedIn = await this.authService.isLoggedIn();
      
      if (isLoggedIn) {
        await this.loadingService.showLoading('Cargando datos...');
        
        const userEmail = await this.authService.getUserActive();
        const userData: IUser = await this.userService.getUserByEmail(userEmail);
        
        // Auto-llenar campos del formulario
        if (userData) {
          this.name = userData.name || '';
          this.email = userData.email || '';
          this.mobile = userData.phone || '';
          this.birthdate = userData.birthDate ? this.formatDate(userData.birthDate) : '';
        }
        
        await this.loadingService.hideLoading();
      }
    } catch (error) {
      await this.loadingService.hideLoading();
      console.error('Error al cargar datos del usuario:', error);
      // No mostramos error, simplemente no llenamos los campos
    }
  }
  
  /**
   * Format date to YYYY-MM-DD
   */
  private formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
