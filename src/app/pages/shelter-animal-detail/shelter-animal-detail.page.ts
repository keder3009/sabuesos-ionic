import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ShelterAnimalService } from 'src/app/services/shelter-animal.service';
import { IShelterAnimal } from 'src/app/shared/types/shelter-animal.interface';

@Component({
  selector: 'app-shelter-animal-detail',
  templateUrl: './shelter-animal-detail.page.html',
  styleUrls: ['./shelter-animal-detail.page.scss'],
})
export class ShelterAnimalDetailPage implements OnInit {
  public animal: IShelterAnimal;
  public currentPhotoIndex = 0;
  private animalId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private shelterAnimalService: ShelterAnimalService,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private navCtrl: NavController,
    private router: Router,
    private actionSheetCtrl: ActionSheetController
  ) {}

  async ngOnInit() {
    this.animalId = this.activatedRoute.snapshot.paramMap.get('id');
    
    // Intentar obtener el animal desde el estado de navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['animal']) {
      this.animal = navigation.extras.state['animal'];
    } else if (history.state?.animal) {
      // Fallback al history.state
      this.animal = history.state.animal;
    }
    
    // Si no hay animal en el estado, mostrar error
    if (!this.animal) {
      this.alertService.infoAlert('No se pudo cargar la información de la mascota.');
      this.goBack();
    }
  }

  /**
   * Load animal detail from API
   */
  async loadAnimalDetail() {
    // Este método ya no se usa, pero lo mantenemos por compatibilidad
    try {
      await this.loadingService.showLoading();
      // Ya no hacemos llamada a la API porque el objeto viene desde la navegación
      await this.loadingService.hideLoading();
    } catch (error) {
      await this.loadingService.hideLoading();
      console.error(error);
      this.alertService.infoAlert('Ocurrió un error al intentar obtener la información.');
      this.goBack();
    }
  }

  /**
   * Go back to list
   */
  goBack() {
    this.navCtrl.back();
  }

  /**
   * Share animal information
   */
  async shareAnimal() {
    try {
      const animalUrl = `https://www.sabuesos.com.co/?animalId=${this.animal.id}`;
      const speciesLabel = this.animal.species?.label || 'Animal';
      const breedLabel = this.animal.breed?.label || 'Sin raza';
      const location = this.animal.location || 'Sin ubicación';
      const shareText = `¡Conoce a ${this.animal.name}!\n\n${speciesLabel} en adopción\nRaza: ${breedLabel}\nUbicación: ${location}\n\n${animalUrl}`;
      
      await Share.share({
        title: `Adopta a ${this.animal.name}`,
        text: shareText,
        url: animalUrl,
        dialogTitle: 'Compartir mascota',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  /**
   * Get current photo URL
   */
  getCurrentPhoto(): string {
    if (!this.animal?.photos || this.animal.photos.length === 0) {
      return '/assets/no-image.png';
    }
    const photoUrl = this.animal.photos[this.currentPhotoIndex]?.url;
    
    if (!photoUrl) {
      return '/assets/no-image.png';
    }
    
    // Si la URL es relativa, agregar el dominio base
    if (photoUrl.startsWith('/')) {
      return 'https://api.sabuesos.com.co' + photoUrl;
    }
    
    return photoUrl;
  }

  /**
   * Navigate to previous photo
   */
  previousPhoto() {
    if (!this.animal?.photos?.length) return;
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
    } else {
      this.currentPhotoIndex = this.animal.photos.length - 1;
    }
  }

  /**
   * Navigate to next photo
   */
  nextPhoto() {
    if (!this.animal?.photos?.length) return;
    if (this.currentPhotoIndex < this.animal.photos.length - 1) {
      this.currentPhotoIndex++;
    } else {
      this.currentPhotoIndex = 0;
    }
  }

  /**
   * Calculate age in years
   */
  getAge(): string {
    if (!this.animal || this.animal.approxAgeMonths == null) return 'N/A';
    const years = Math.floor(this.animal.approxAgeMonths / 12);
    const months = this.animal.approxAgeMonths % 12;
    
    if (years === 0) {
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    } else if (months === 0) {
      return `${years} ${years === 1 ? 'año' : 'años'}`;
    } else {
      return `${years} ${years === 1 ? 'año' : 'años'} ${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
  }

  /**
   * Show interest in adopting
   */
  showInterest() {
    // Navegar al formulario de adopción
    this.navCtrl.navigateForward(['main-tab/shelter-adoption-form', this.animal.id], {
      state: { animal: this.animal }
    });
  }

  /**
   * Show contact options action sheet
   */
  async showContactOptions() {
    const buttons: any[] = [];

    if (this.animal?.shelter?.whatsapp) {
      buttons.push({
        text: 'WhatsApp',
        icon: 'logo-whatsapp',
        handler: async () => {
          await Browser.open({ url: `https://wa.me/${this.animal.shelter.whatsapp}` });
        }
      });
    }

    if (this.animal?.shelter?.instagram) {
      buttons.push({
        text: 'Instagram',
        icon: 'logo-instagram',
        handler: async () => {
          await Browser.open({ url: this.animal.shelter.instagram });
        }
      });
    }

    if (this.animal?.shelter?.websiteUrl) {
      buttons.push({
        text: 'Sitio web',
        icon: 'globe-outline',
        handler: async () => {
          await Browser.open({ url: this.animal.shelter.websiteUrl });
        }
      });
    }

    if (this.animal?.shelter?.contactEmail) {
      buttons.push({
        text: 'Email',
        icon: 'mail-outline',
        handler: () => {
          const link = document.createElement('a');
          link.href = `mailto:${this.animal.shelter.contactEmail}`;
          link.target = '_system';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    }

    if (this.animal?.shelter?.contactPhone) {
      buttons.push({
        text: 'Llamar',
        icon: 'call-outline',
        handler: () => {
          const link = document.createElement('a');
          link.href = `tel:${this.animal.shelter.contactPhone}`;
          link.target = '_system';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    }

    buttons.push({
      text: 'Cancelar',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Contactar',
      buttons: buttons
    });

    await actionSheet.present();
  }
}
