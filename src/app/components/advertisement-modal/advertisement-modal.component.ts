import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { IAdvertisement } from 'src/app/shared/types/advertisement.interface';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-advertisement-modal',
  template: `
  <ion-content>
      <div class="ad-container">
        <div class="timer-container" *ngIf="remainingTime > 0">
          <span class="timer">{{remainingTime}}s</span>
        </div>

        <div class="close-container" *ngIf="remainingTime === 0">
          <ion-button class="close-button" 
                      (click)="dismiss()"
                      expand="block"
                      fill="solid"
                      color="light">
            <ion-icon name="close-circle-outline" slot="start"></ion-icon>
            Cerrar anuncio
          </ion-button>
        </div>

        <ng-container [ngSwitch]="advertisement.mediaType">
          <div class="video-container" *ngSwitchCase="'video'">
            <video #videoPlayer
                  *ngSwitchCase="'video'"
                  [src]="advertisement.mediaUrl"
                  playsinline
                  autoplay
                  muted
                  loop
                  preload="auto"
                  (loadedmetadata)="onVideoMetadata()"
                  (canplay)="onCanPlay()"
                  (playing)="onVideoPlaying()"
                  (error)="onVideoError($event)"
                  (ended)="onVideoEnd()"
                  controls="false"
                  class="media-content no-poster">
            </video>

            <div class="video-loading-overlay" *ngIf="!videoReady">
              <div class="spinner"></div>
            </div>
          </div>

          <img #imageElement
               *ngSwitchCase="'image'" 
               [src]="advertisement.mediaUrl" 
               (load)="onImageLoad()"
               (error)="onImageError($event)"
               (click)="openLink()"
               class="media-content">
        </ng-container>

        <div *ngIf="advertisement.title || advertisement.description" class="ad-info">
          <h2 *ngIf="advertisement.title">{{advertisement.title}}</h2>
          <p *ngIf="advertisement.description">{{advertisement.description}}</p>
          <ion-button *ngIf="advertisement.link && remainingTime === 0"
                      expand="block"
                      fill="solid"
                      color="primary"
                      class="link-button"
                      (click)="openLink()">
            Ver más
          </ion-button>
        </div>
    </div>
  </ion-content>
  `,
  styles: [`
    .ad-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.8);
    }

    .video-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .media-content {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: black;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid white;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .timer-container {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 100;
      background: rgba(0,0,0,0.7);
      border-radius: 20px;
      padding: 5px 15px;
    }

    .timer {
      color: white;
      font-size: 1.2em;
      font-weight: bold;
    }

    .close-container {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 100;
      animation: fadeIn 0.3s ease-in;
    }

    .close-button {
      --border-radius: 20px;
      font-weight: bold;
    }

    .media-content {
      max-width: 90%;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 8px;
      background: black; /* para evitar flashes blancos */
    }

    /* Quitar poster / icono en android */
    video.no-poster::-webkit-media-controls-start-playback-button {
      display:none !important;
      -webkit-appearance:none;
    }

    video.no-poster::-webkit-media-controls {
      display:none !important;
    }

    video.no-poster::before {
      content: none !important;
    }

    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(0,0,0,0.5);
      border-radius: 8px;
      color: white;
    }

    video {
      width: 100%;
      max-height: 80vh;
      object-fit: contain;
    }

    .ad-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px;
      background: linear-gradient(transparent, rgba(0,0,0,0.9));
      color: white;
      text-align: center;
    }

    h2 {
      margin: 0;
      font-size: 1.4em;
      font-weight: bold;
    }

    p {
      margin: 10px 0;
      font-size: 1.1em;
    }

    .link-button {
      margin-top: 15px;
      --border-radius: 20px;
      font-weight: bold;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class AdvertisementModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() advertisement: IAdvertisement;
  @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef<HTMLVideoElement>;
  @ViewChild('imageElement') imageElement: ElementRef<HTMLImageElement>;

  remainingTime: number = 0;
  loading: boolean = true;
  imageError: boolean = false;
  isAndroid: boolean = false;
  videoReady: boolean = false;

  private timerSubscription?: Subscription;
  private autoCloseSubscription?: Subscription;
  private videoSetupDone = false;
  private playAttempts = 0;
  private maxPlayAttempts = 5;

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform
  ) {
    this.isAndroid = this.platform.is('android');
  }

  ngOnInit() {
    if (this.advertisement.mediaType === 'image') {
      this.preloadImage();
    }
  }

  ngAfterViewChecked() {
    if (this.advertisement?.mediaType === 'video' && !this.videoSetupDone && this.videoPlayer) {
      this.setupVideoPlayer();
      this.videoSetupDone = true;
    }
  }

  private preloadImage() {
    this.loading = true;
    if (this.advertisement.mediaUrl) {
      const img = new Image();
      img.src = this.advertisement.mediaUrl;
      img.onload = () => {
        this.imageError = false;
        this.finishLoading();
      };
      img.onerror = () => {
        this.imageError = true;
        this.finishLoading();
      };
    }
  }

  private finishLoading() {
    this.loading = false;
    this.initializeTimer();
  }

  ngAfterViewInit() {
    if (this.advertisement.mediaType === 'video') {
      setTimeout(() => {
        this.setupVideoPlayer();
      });
    }
  }

  private setupVideoPlayer() {
    const video = this.videoPlayer?.nativeElement;
    console.log(video, "kevin");
    if (!video) {
      this.imageError = true;
      this.finishLoading();
      return;
    }

    video.preload = 'auto';

    // Establecer muted para que autoplay funcione en web
    video.muted = true;

    // Desactivar controles para no mostrar nada
    video.controls = false;

    // Agregar eventos
    video.oncanplay = () => this.onCanPlay();
    video.onplaying = () => this.onVideoPlaying();
    video.onerror = (err) => this.onVideoError(err);
    video.onended = () => this.onVideoEnd();

    // Intentar autoplay mutado
    this.tryPlayVideo();
  }

  private async tryPlayVideo() {
    const video = this.videoPlayer?.nativeElement;

    if (!video) {
      this.imageError = true;
      this.finishLoading();
      return;
    }

    console.log('Intentando reproducir video, muted:', video.muted);


    try {
      await video.play();
      console.log('Video se está reproduciendo');
      // Opcional: puedes quitar el mute después de unos segundos
      setTimeout(() => {
        video.muted = false;
        video.volume = 1;
        console.log('Quito mute después de 1 segundos');
      }, 500);
    } catch (err) {
      console.warn('No se pudo reproducir el video automáticamente con sonido, intentamos mutear y reproducir', err);
      video.muted = true;
      try {
        await video.play();
        console.log('Video se está reproduciendo mutado');
      } catch (error) {
        console.error('Error al reproducir video mutado:', error);
        this.imageError = true;
        this.finishLoading();
      }
    }
  }

  onVideoMetadata() {
    // Aquí podrías obtener duración o preparar algo
  }

  onCanPlay() {
    this.videoReady = true;
    // Video listo para reproducirse
  }

  onVideoPlaying() {
    this.imageError = false;
    this.finishLoading();
  }

  onVideoError(error: any) {
    this.imageError = true;
    this.finishLoading();
  }

  onVideoEnd() {
    this.remainingTime = 0;
    if (this.advertisement.skipAfter) {
      this.dismiss();
    }
  }

  onImageLoad() {
    this.imageError = false;
    this.finishLoading();
  }

  onImageError(event: any) {
    this.imageError = true;
    this.finishLoading();
  }

  private initializeTimer() {
    this.remainingTime = this.advertisement.waitTime || 5;
    this.timerSubscription?.unsubscribe();

    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        if (this.remainingTime === 0) {
          this.timerSubscription?.unsubscribe();
          this.setupAutoClose();
        }
      }
    });
  }

  private setupAutoClose() {
    if (this.advertisement.skipAfter) {
      this.autoCloseSubscription = interval(1000).pipe(
        take(this.advertisement.skipAfter)
      ).subscribe({
        complete: () => this.dismiss()
      });
    }
  }

  dismiss() {
    if (this.timerSubscription) this.timerSubscription.unsubscribe();
    if (this.autoCloseSubscription) this.autoCloseSubscription.unsubscribe();
    this.modalCtrl.dismiss();
  }

  openLink() {
    if (this.advertisement.link) {
      window.open(this.advertisement.link, '_blank');
    }
  }

  ngOnDestroy() {
    if (this.timerSubscription) this.timerSubscription.unsubscribe();
    if (this.autoCloseSubscription) this.autoCloseSubscription.unsubscribe();
  }
}
