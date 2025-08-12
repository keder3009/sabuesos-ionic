export interface IAdvertisement {
    id: string;
    type: 'popup' | 'native';
    title?: string;
    description?: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    link?: string;
    order?: number;
    active: boolean;
    waitTime: number;  // Tiempo en segundos antes de poder cerrar
    skipAfter?: number;  // Tiempo en segundos después del cual se cierra automáticamente (opcional)
    createdAt: Date;
    updatedAt: Date;
} 