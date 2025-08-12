import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { googleAdmod, ResponseInitNativeAdss } from "capacitor-admob-keder";
import { AdMob, AdOptions, AdmobConsentStatus, InterstitialAdPluginEvents, AdLoadInfo } from '@capacitor-community/admob';
import { BehaviorSubject } from 'rxjs';
import { AdvertisementService } from './advertisement.service';
import { IAdvertisement } from '../shared/types/advertisement.interface';
import { ModalController } from '@ionic/angular';
import { AdvertisementModalComponent } from '../components/advertisement-modal/advertisement-modal.component';

@Injectable({
    providedIn: 'root'
})
export class AdmobService {
    private platformId: string;
    private platform = Capacitor.getPlatform();

    private nativeAdsSubject = new BehaviorSubject<ResponseInitNativeAdss[] | null>(this.getStoredAds());
    public nativeAds$ = this.nativeAdsSubject.asObservable();

    constructor(
        private advertisementService: AdvertisementService,
        private modalCtrl: ModalController
    ) {
        this.setAdUnitIds();
    }

    private convertFirebaseAdsToNative(firebaseAds: IAdvertisement[]): ResponseInitNativeAdss[] {
        return firebaseAds.map(ad => ({
            adKey: ad.id,
            headline: ad.title || '',
            imageUrl: ad.mediaUrl,
            cover: ad.mediaUrl,
            body: ad.description || '',
            callToAction: 'Ver más',
            link: ad.link || '',
            price: '',
            icon: '',
            store: ''
        }));
    }

    private getStoredAds(): ResponseInitNativeAdss[] | null {
        const stored = localStorage.getItem('nativeAds');
        const storedTime = localStorage.getItem('nativeAdsTimestamp');

        if (!stored || !storedTime) {
            return [];
        }

        const timeElapsed = Date.now() - parseInt(storedTime, 10);
        const hoursElapsed = timeElapsed / (1000 * 60 * 60);

        if (hoursElapsed > 24) {
            console.log("🗑️ Caché eliminada por superar las 24 horas.");
            localStorage.removeItem('nativeAds');
            localStorage.removeItem('nativeAdsTimestamp');
            return [];
        }

        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error("Error al parsear localStorage:", error);
            return [];
        }
    }

    private storeAds(ads: ResponseInitNativeAdss[]): void {
        try {
            localStorage.setItem('nativeAds', JSON.stringify(ads));
            localStorage.setItem('nativeAdsTimestamp', Date.now().toString());
        } catch (error) {
            console.error("Error al guardar en localStorage:", error);
        }
    }

    private setAdUnitIds() {
        if (this.platform === 'ios') {
            this.platformId = 'ca-app-pub-9998601387563157~6612745468';
        } else {
            this.platformId = 'ca-app-pub-9998601387563157~2848798267';
        }
    }

async initialize(): Promise<void> {
    try {
        await AdMob.initialize();
        console.log('[AdMob] Inicializado correctamente');

        let trackingInfo: any = null;
        let consentInfo: any = null;

        try {
            trackingInfo = await AdMob.trackingAuthorizationStatus();
            console.log('[AdMob] trackingAuthorizationStatus:', trackingInfo);
        } catch (error) {
            console.error('Error obteniendo trackingAuthorizationStatus:', error);
        }

        try {
            consentInfo = await AdMob.requestConsentInfo();
            console.log('[AdMob] requestConsentInfo:', consentInfo);
        } catch (error) {
            console.error('Error obteniendo requestConsentInfo:', error);
        }

        if (trackingInfo?.status === 'notDetermined') {
            try {
                await AdMob.requestTrackingAuthorization();
                console.log('[AdMob] Tracking authorization solicitado');
            } catch (error) {
                console.error('Error solicitando autorización de tracking:', error);
            }
        }

        const authorizationStatus = await AdMob.trackingAuthorizationStatus();
        console.log('[AdMob] authorizationStatus después de tracking:', authorizationStatus);

        if (
            authorizationStatus?.status === 'authorized' &&
            consentInfo?.isConsentFormAvailable &&
            consentInfo?.status === AdmobConsentStatus.REQUIRED
        ) {
            try {
                await AdMob.showConsentForm();
                console.log('[AdMob] Formulario de consentimiento mostrado');
            } catch (error) {
                console.error('Error mostrando formulario de consentimiento:', error);
            }
        }

        // 🔽 Ahora continúa con tu lógica de carga de anuncios desde Firebase
        try {
            const { popupAds, nativeAds } = await this.advertisementService.loadAdvertisements();
            console.log(`[AdMob] Anuncios cargados desde Firebase: ${popupAds.length} popup, ${nativeAds.length} nativos`);

            const firebaseNative = this.convertFirebaseAdsToNative(nativeAds);
            this.nativeAdsSubject.next(firebaseNative);

            if (popupAds.length > 0) {
                this.showFirebasePopupAd(popupAds[0]);
            } else {
                await this.showInterstitialAd();
            }

            // 🔽 Mostrar anuncios nativos combinados
            await this.showNativeAdd();
        } catch (error) {
            console.error('Error cargando anuncios desde Firebase o mostrando anuncios:', error);
        }

    } catch (error) {
        console.error('Error general durante initialize():', error);
    }
}


    private async showFirebasePopupAd(ad: IAdvertisement) {
        try {
            const modal = await this.modalCtrl.create({
                component: AdvertisementModalComponent,
                componentProps: {
                    advertisement: ad
                },
                cssClass: 'advertisement-modal',
                backdropDismiss: false
            });

            await modal.present();
            console.log('✅ Modal de anuncio mostrado correctamente');
        } catch (error) {
            console.error('❌ Error al mostrar el modal de anuncio:', error);
        }
    }

    async hideBannerAd() {
        try {
            await AdMob.hideBanner();
            console.log('Banner ocultado');
        } catch (error) {
            console.error('Error al ocultar el banner:', error);
        }
    }

    async showInterstitialAd() {
        const adId = this.platform === 'ios' ? "ca-app-pub-9998601387563157/2448804019" : "ca-app-pub-9998601387563157/3400258761"
        const options: AdOptions = {
            adId
        };

        try {
            await AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
                // Subscribe prepared interstitial
            });
        } catch (error) {
            console.error(`Error al mostrar el anuncio intersticial: ${error}`);
            return;
        }

        try {
            await AdMob.prepareInterstitial(options);
            await AdMob.showInterstitial();
            console.log('Anuncio intersticial mostrado');
        } catch (error) {
            console.error('Error al mostrar el anuncio intersticial:', error);
        }
    }

    async showNativeAdd(): Promise<ResponseInitNativeAdss[] | null> {
        const adId = this.platform === 'ios'
            ? "ca-app-pub-9998601387563157/8269442064"
            : "ca-app-pub-9998601387563157/6827571723";

        const storedAds = this.getStoredAds();
        const currentAds = this.nativeAdsSubject.getValue() || [];
        const finalAds = [...currentAds, ...storedAds];
        if (storedAds.length === 0) {
            try {
                const result: any = await googleAdmod.initNativeAds({ idAdd: adId });
                const updatedAds = [...currentAds, ...result.ads];
                this.nativeAdsSubject.next(updatedAds);
                this.storeAds(result.ads);
                return updatedAds;
            } catch (error) {
                console.error('Error al mostrar el anuncio nativo:', error);
                return finalAds;
            }
        } else {
            this.nativeAdsSubject.next(finalAds);
            return finalAds;
        }
    }

    async openAd(id: any) {
        try {
            await googleAdmod.recordClick({ adKey: id });
            console.log("✅ Clic en el anuncio registrado.");
        } catch (error) {
            console.error("❌ Error al registrar clic en el anuncio:", error);
        }
    }
}