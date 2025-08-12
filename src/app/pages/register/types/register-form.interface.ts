import { Role } from "src/app/shared/types/role.interface";

export interface IRegister {
    _id?: string;
    name: string;
    email: string;
    picture: string | null;
    role: Role,
    hasPet: boolean;
    city?: string | null;
    locality?: string | null;
    oneSignalId?: string;
}
