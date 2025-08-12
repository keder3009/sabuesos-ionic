import { Role } from "src/app/shared/types/role.interface";

export interface ILogin {
    _id?: string;
    idFirebase?: string;
    name?: string;
    bearer?: string;
    role?: Role;
    email: string;
    password?: string;
    city?: string;
    locality?: string;
    isVerified?: boolean;
}
