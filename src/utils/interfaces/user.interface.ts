export interface IUser {
    uid?: string;
    email?: string;
    role?: string;
    status?: string;
}
export enum USER_STATUS {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BANNED = 'BANNED',
    DELETED = 'DELETED',
    PENDING = 'PENDING',
    SUSPENDED = 'SUSPENDED',
    BLOCKED = 'BLOCKED'
}
export const USER_STATUS_AND_ERROR = {
    [USER_STATUS.INACTIVE]: "Your Account is Not Active,Please Verify Your Email",
    [USER_STATUS.BANNED]: "Your Account is Banned,Please Contact Administrator",
    [USER_STATUS.DELETED]: "No Account With This Email Found",
    [USER_STATUS.PENDING]: "Your Account is Pending,Please Wait For Approval",
    [USER_STATUS.SUSPENDED]: "Your Account is Suspended,Due to violation of Terms and Conditions",
    [USER_STATUS.BLOCKED]: "Your Account is Blocked,Due to Many Failed Login Attempts",
}
export enum AppRoles {
    GUEST = 'GUEST',
    USER = 'USER',
    ADMIN = 'ADMIN',
    SUPERVISER = 'SUPERVISER',
    MANAGER = 'MANAGER',
    SUPERADMIN = 'SUPERADMIN',
}
export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}

export const UserRolesArray = Object.values(AppRoles);
export type AllowedRoles = keyof typeof AppRoles;
