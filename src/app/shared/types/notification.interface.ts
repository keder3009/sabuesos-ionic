import { NativeGeocoderResult } from "@awesome-cordova-plugins/native-geocoder/ngx";
import { IUser } from "./user.interface";

export interface INotification {
    users?: IUser[];
    userSend?: string;
    hideNotification?: string[];
    viewAction?: boolean;
    topic?: string;
    deviceIds?: Array<string>;
    title?: string;
    bodyMessage?: string;
    body?: string;
    silent?: string;
    nativeGeocoderResult?: NativeGeocoderResult
}
