import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { FileData } from 'src/app/shared/types/file-data.interface';
import { register } from 'swiper/element/bundle';
import { AdmobService } from "src/app/services/admod.service";

register();
@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
})
export class SlidesComponent implements OnInit {
  @Input() option: string;
  @Input() isSlide: boolean = true;
  @Input() slides: FileData[] = [];

  public nativeAds: any[] = [];

  constructor(private navCtrl: NavController, private utilService: UtilsService, private admobService: AdmobService) {

  }

  async ngOnInit() {
    this.updateSlides();
    this.admobService.nativeAds$.subscribe(ads => {
      if (ads) {
        this.nativeAds = ads;
        this.updateSlides();
      }
    });
  }

  private updateSlides() {
    if (this.option === 'advertising') {
      console.log(this.nativeAds);

      this.slides = this.nativeAds.length > 0
        ? this.nativeAds.map(ad => ({
          name: 'slide-ad',
          url: ad.cover || ad.imageUrl,
          id: ad.id,
          link: ad.link || ad.url,
        }))
        : [
          { name: 'slide-1', url: '/assets/slides/sabuesos-ad_1-100.jpg' },
          { name: 'slide-1', url: '/assets/slides/sabuesos-ad-8.png' },
          { name: 'slide-1', url: '/assets/slides/sabuesos-ad_2-8.png' },
          { name: 'slide-1', url: '/assets/slides/sabuesos-ad_3-8.png' }
        ];
    } else if (this.option === 'view-report' && this.slides.length === 0) {
      this.slides.push({ name: 'not found', url: '/assets/img_pets/dont_found.png' });
    }
    console.log('Slides updated:', this.slides);

  }

  onClick() {
    this.navCtrl.navigateBack('/');
  }

  async openAd(slide: any) {
    if (!slide.id) return this.openLink(slide);
    try {
      await this.admobService.openAd(slide.id);
    } catch (error) {
      console.error('Error al abrir el anuncio:', error)

    }
  }

  openLink(slide: any) {
    if (slide.link) window.open(slide.link, '_blank');
  }

  private async fetchEuthanasiaImageFiles(): Promise<void> {
    if (this.slides) {
      for (let i = 0; i < this.slides.length; i++) {
        this.slides[i] = await this.utilService.fetchFileDataURL(this.slides[i].url, 'image/png');
      }
    }
  }
}
