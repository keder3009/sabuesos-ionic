import { Role } from "./role.interface";

export interface IEntity {
    _id?: string;
    name: string;
    email: string;
    city: string;
    picture?: any;
    role: Role;
    document: string;
    phone: string;
    contactPerson: string;
    address: string;
    webpage?: string;
    facebook?: string;
    twitter?: string;
    socialNetworks?: string;
    oneSignalId?: string;
    isVerified?: boolean;
}
