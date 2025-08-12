import { Role } from "./role.interface";
import {FileData} from "./file-data.interface";

export interface IUser {
    _id?: string;
    name: string;
    birthDate?: Date;
    email: string;
    city?: string;
    picture?: FileData;
    role: Role;
    password: string;
    hasPet?: boolean;
    locality?: string;
}
