import { Role } from "./role.interface";

export interface UserFirebase {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    role?: Role;
}