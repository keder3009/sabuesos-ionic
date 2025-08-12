// src/app/pages/app-admin-ads/create-ad-modal/create-ad-modal.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AdvertisementService } from '../../../services/advertisement.service';
import { IAdvertisement } from '../../../shared/types/advertisement.interface';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-create-ad-modal',
  templateUrl: './create-ad-modal.component.html',
  styleUrls: ['./create-ad-modal.component.scss'],
})
export class CreateAdModalComponent implements OnInit {
  @Input() advertisement: IAdvertisement | null = null;
  @Input() isEdit: boolean = false;

  adForm: FormGroup;
  selectedFile: File | null = null;
  mediaPreview: string | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;

  typeOptions = [
    { value: 'popup', label: 'Pop-up' },
    { value: 'native', label: 'Nativo' }
  ];

  mediaTypeOptions = [
    { value: 'image', label: 'Imagen' },
    { value: 'video', label: 'Video' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private adService: AdvertisementService,
    private authService: AuthService
  ) {
    this.createForm();
  }

  ngOnInit() {
    if (this.isEdit && this.advertisement) {
      this.populateForm();
    }
  }

  createForm() {
    this.adForm = this.formBuilder.group({
      type: ['popup', Validators.required],
      title: [''],
      description: [''],
      mediaType: ['image', Validators.required],
      link: [''],
      order: [1, [Validators.min(1), Validators.max(100)]],
      active: [true],
      waitTime: [3, [Validators.min(0), Validators.max(60)]],
      skipAfter: [null, [Validators.min(1)]]
    });
  }

  populateForm() {
    if (this.advertisement) {
      this.adForm.patchValue({
        type: this.advertisement.type,
        title: this.advertisement.title || '',
        description: this.advertisement.description || '',
        mediaType: this.advertisement.mediaType,
        link: this.advertisement.link || '',
        order: this.advertisement.order || 1,
        active: this.advertisement.active,
        waitTime: this.advertisement.waitTime,
        skipAfter: this.advertisement.skipAfter || null
      });
      this.mediaPreview = this.advertisement.mediaUrl;
      this.adForm.markAllAsTouched();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const mediaType = this.adForm.get('mediaType')?.value;

      // Validar tipo de archivo según mediaType seleccionado
      if (mediaType === 'image' && !file.type.startsWith('image/')) {
        this.showAlert('Error', 'Por favor selecciona un archivo de imagen válido.');
        return;
      }

      if (mediaType === 'video' && !file.type.startsWith('video/')) {
        this.showAlert('Error', 'Por favor selecciona un archivo de video válido.');
        return;
      }

      // Validar tamaño (máximo 10MB para video, 5MB para imagen)
      const maxSize = mediaType === 'video' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        const maxSizeText = mediaType === 'video' ? '10MB' : '5MB';
        this.showAlert('Error', `El archivo no puede ser mayor a ${maxSizeText}.`);
        return;
      }

      this.selectedFile = file;

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.mediaPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // En create-ad-modal.component.ts - método onSubmit() corregido
  async onSubmit() {
    if (this.adForm.valid) {
      if (!this.isEdit && !this.selectedFile) {
        this.showAlert('Error', 'Por favor selecciona un archivo multimedia.');
        return;
      }

      const loading = await this.loadingController.create({
        message: this.isEdit ? 'Actualizando...' : 'Creando...'
      });
      await loading.present();

      try {
        let mediaUrl = this.advertisement?.mediaUrl || '';

        // Subir nuevo archivo si se seleccionó
        if (this.selectedFile) {
          this.isUploading = true;

          try {
            // Usar el método uploadMedia del servicio tal como está definido
            mediaUrl = await this.adService.uploadMedia(this.selectedFile);
          } catch (uploadError) {
            console.error('Error al subir archivo:', uploadError);
            this.showAlert('Error', 'No se pudo subir el archivo. Inténtalo de nuevo.');
            loading.dismiss();
            this.isUploading = false;
            return;
          }
        }

        const formValue = this.adForm.value;

        const adData: Omit<IAdvertisement, 'id'> = {
          type: formValue.type,
          title: formValue.title || undefined,
          description: formValue.description || undefined,
          mediaUrl,
          mediaType: formValue.mediaType,
          link: formValue.link || undefined,
          order: formValue.order || undefined,
          active: formValue.active,
          waitTime: formValue.waitTime,
          skipAfter: formValue.skipAfter || undefined,
          createdAt: this.isEdit ? this.advertisement!.createdAt : new Date(),
          updatedAt: new Date()
        };

        if (this.isEdit) {
          await this.adService.updateAdvertisement(this.advertisement!.id, adData);
          this.dismiss({ updated: true });
        } else {
          await this.adService.createAdvertisement(adData);
          this.dismiss({ created: true });
        }

      } catch (error) {
        console.error('Error al guardar publicidad:', error);
        this.showAlert('Error', 'No se pudo guardar la publicidad. Inténtalo de nuevo.');
      } finally {
        loading.dismiss();
        this.isUploading = false;
        this.uploadProgress = 0;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.adForm.controls).forEach(key => {
      const control = this.adForm.get(key);
      control?.markAsTouched();
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  dismiss(data?: any) {
    this.modalController.dismiss(data);
  }

  // Getters para validaciones
  get waitTimeError() {
    const control = this.adForm.get('waitTime');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'El tiempo de espera es requerido';
      if (control.errors['min']) return 'El tiempo mínimo es 0 segundos';
      if (control.errors['max']) return 'El tiempo máximo es 60 segundos';
    }
    return null;
  }

  get orderError() {
    const control = this.adForm.get('order');
    if (control?.touched && control?.errors) {
      if (control.errors['min']) return 'El orden mínimo es 1';
      if (control.errors['max']) return 'El orden máximo es 100';
    }
    return null;
  }

  get skipAfterError() {
    const control = this.adForm.get('skipAfter');
    if (control?.touched && control?.errors) {
      if (control.errors['min']) return 'El tiempo debe ser mayor a 0';
    }
    return null;
  }

  get acceptedFileTypes(): string {
    const mediaType = this.adForm.get('mediaType')?.value;
    if (mediaType === 'video') {
      return 'video/*';
    }
    return 'image/*';
  }

  get fileTypePlaceholder(): string {
    const mediaType = this.adForm.get('mediaType')?.value;
    if (mediaType === 'video') {
      return 'Máximo 10MB - MP4, WebM, AVI';
    }
    return 'Máximo 5MB - JPG, PNG, WebP';
  }

  get isSubmitDisabled(): boolean {
    if (this.isUploading) {
      return true;
    }

    if (!this.isEdit) {
      return this.adForm.invalid || !this.selectedFile;
    }
    return this.adForm.invalid;
  }

  // Detectar cambio en mediaType para limpiar archivo seleccionado
  onMediaTypeChange() {
    this.selectedFile = null;
    this.mediaPreview = null;
    this.uploadProgress = 0;
  }
}