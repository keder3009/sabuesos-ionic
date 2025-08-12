import { NativeGeocoderResult } from "@awesome-cordova-plugins/native-geocoder/ngx";
import { IEntity } from "./entity.interface";
import { IPet } from "./pet.interface";
import { Role } from "./role.interface";
import { IUser } from "./user.interface";
import { FileData } from "./file-data.interface";
export interface IReport {
    _id?: string;
    description: string;
    longitude: number;
    latitude: number;
    typePost: TypePost;
    status: StatusPost;
    reported: boolean;
    actorRole: Role;
    userId?: string;
    entityId?: string;
    petId?: string;
    users?: IUser;
    entities?: IEntity;
    pets?: IPet;
    favoriteUsers?: IUser[];
    favoriteEntities?: IEntity[];
    filesUrl?: FileData[];
    nativeGeocoderResult: NativeGeocoderResult;
    isAd?: boolean;
}

export interface IAdReport extends IReport {
    isAd: boolean;
    adChoicesUrl: string;
    body:string;
    cover:string;
    cta: string;
    headline: string;
    advertiser: string;
    icon: string;
    id: string;
}

export enum StatusPost {
    INACTIVE = 0,
    ACTIVE = 1,
}

export enum TypePost {
    LOST = 0,
    FIND = 1,
    ADOPTION = 2
}
