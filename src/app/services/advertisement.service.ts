import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map, firstValueFrom, Observable, finalize } from 'rxjs';
import { IAdvertisement } from '../shared/types/advertisement.interface';
import {
    DEFAULT_AD_WAIT_TIME,
    DEFAULT_AD_SKIP_TIME,
    DEFAULT_VIDEO_WAIT_TIME
} from '../shared/constants/advertisement.constants';

@Injectable({
    providedIn: 'root'
})
export class AdvertisementService {
    private collectionName = 'advertisements';
    constructor(
        private firestore: AngularFirestore,
        private storage: AngularFireStorage
    ) {
        this.loadAdvertisements();
    }

    getAdvertisements(): Observable<IAdvertisement[]> {
        return this.firestore.collection<IAdvertisement>("advertisements", ref =>
            ref.orderBy('order', 'asc')
        ).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as any; // Usar 'any' temporalmente
                const id = a.payload.doc.id;

                // Función helper para convertir timestamps
                const convertTimestamp = (timestamp: any): Date => {
                    if (!timestamp) return new Date();
                    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
                        return timestamp.toDate();
                    }
                    if (timestamp instanceof Date) {
                        return timestamp;
                    }
                    return new Date(timestamp);
                };

                return {
                    id,
                    ...data,
                    createdAt: convertTimestamp(data.createdAt),
                    updatedAt: convertTimestamp(data.updatedAt)
                } as IAdvertisement;
            }))
        );
    }

    getAdvertisementById(id: string): Observable<IAdvertisement> {
        return this.firestore.doc<IAdvertisement>(`${this.collectionName}/${id}`).valueChanges();
    }

    private setDefaultTimes(ad: IAdvertisement): IAdvertisement {
        return {
            ...ad,
            waitTime: ad.waitTime ?? (ad.mediaType === 'video' ? DEFAULT_VIDEO_WAIT_TIME : DEFAULT_AD_WAIT_TIME),
            skipAfter: ad.skipAfter ?? (ad.mediaType === 'video' ? null : DEFAULT_AD_SKIP_TIME)
        };
    }

    public async loadAdvertisements(): Promise<any> {
        try {
            const ads = await firstValueFrom(
                this.firestore.collection<IAdvertisement>('advertisements', ref =>
                    ref.where('active', '==', true).orderBy('order', 'asc')
                ).snapshotChanges().pipe(
                    map(actions => actions.map(a => {
                        const data = a.payload.doc.data() as any; // Usar 'any' temporalmente
                        const id = a.payload.doc.id;

                        // Función helper para convertir timestamps
                        const convertTimestamp = (timestamp: any): Date => {
                            if (!timestamp) return new Date();
                            if (timestamp.toDate && typeof timestamp.toDate === 'function') {
                                return timestamp.toDate();
                            }
                            if (timestamp instanceof Date) {
                                return timestamp;
                            }
                            return new Date(timestamp);
                        };

                        const adWithDates = {
                            ...data,
                            id,
                            createdAt: convertTimestamp(data.createdAt),
                            updatedAt: convertTimestamp(data.updatedAt)
                        } as IAdvertisement;

                        return this.setDefaultTimes(adWithDates);
                    }))
                )
            );
            const popupAds = ads.filter(ad => ad.type === 'popup') || [];
            const nativeAds = ads.filter(ad => ad.type === 'native') || [];
            return { popupAds, nativeAds }
        } catch (err) {
            console.error('❌ Error al cargar anuncios de Firestore:', err);
        }
    }

    public async uploadMedia(file: File): Promise<string> {
        const filePath = `advertisements/${new Date().getTime()}_${file.name}`;
        const fileRef = this.storage.ref(filePath);
        await this.storage.upload(filePath, file);
        return await fileRef.getDownloadURL().toPromise();
    }

    public async createAdvertisement(advertisement: Omit<IAdvertisement, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
        const newAd = this.setDefaultTimes({
            ...advertisement,
            createdAt: new Date(),
            updatedAt: new Date()
        } as IAdvertisement);

        await this.firestore.collection('advertisements').add(newAd);
    }

    public async updateAdvertisement(id: string, advertisement: Partial<IAdvertisement>): Promise<void> {
        const updateData = {
            ...advertisement,
            updatedAt: new Date()
        };
        await this.firestore.doc(`advertisements/${id}`).update(updateData);
    }

    public async deleteAdvertisement(id: string, mediaUrl?: string): Promise<void> {
        // Primero eliminar el archivo de Storage si existe
        if (mediaUrl) {
            try {
                // Extraer la ruta del archivo de la URL
                const filePath = this.extractFilePathFromUrl(mediaUrl);
                if (filePath) {
                    await this.storage.ref(filePath).delete().toPromise();
                } else {
                    // Si no se puede extraer la ruta, usar refFromURL
                    await this.storage.refFromURL(mediaUrl).delete().toPromise();
                }
            } catch (error) {
                console.error('Error al eliminar archivo de Storage:', error);
                // Continuar con la eliminación del documento aunque falle el archivo
            }
        }

        await this.firestore.doc(`advertisements/${id}`).delete();
    }

    uploadImage(file: File, path: string): Observable<{ progress: number; url?: string }> {
        const fileRef = this.storage.ref(path);
        const uploadTask = this.storage.upload(path, file);

        return new Observable(observer => {
            uploadTask.percentageChanges().subscribe(progress => {
                observer.next({ progress: progress || 0 });
            });

            uploadTask.snapshotChanges().pipe(
                finalize(() => {
                    fileRef.getDownloadURL().subscribe(url => {
                        observer.next({ progress: 100, url });
                        observer.complete();
                    });
                })
            ).subscribe();
        });
    }
    toggleAdvertisementStatus(id: string, active: boolean): Promise<void> {
        return this.updateAdvertisement(id, { active, updatedAt: new Date() });
    }
    private extractFilePathFromUrl(url: string): string | null {
        try {
            // Ejemplo URL: https://firebasestorage.googleapis.com/v0/b/bucket/o/advertisements%2F123456_image.jpg?alt=media&token=...
            const urlObj = new URL(url);
            const path = urlObj.pathname;

            // Extraer la parte después de '/o/' y antes de '?'
            const match = path.match(/\/o\/(.+)$/);
            if (match) {
                // Decodificar la URL para obtener la ruta real
                return decodeURIComponent(match[1]);
            }
            return null;
        } catch (error) {
            console.error('Error al extraer ruta de URL:', error);
            return null;
        }
    }
} 