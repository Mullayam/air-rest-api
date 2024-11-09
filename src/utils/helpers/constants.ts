export enum USER_STATUS {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BANNED = 'BANNED',
    DELETED = 'DELETED',
    PENDING = 'PENDING',
    SUSPENDED = 'SUSPENDED',
    BLOCKED = 'BLOCKED'
}
export enum USER_ROLE {
    GUEST = 'GUEST',
    USER = 'USER',
    ADMIN = 'ADMIN',
    SUPERVISER = 'SUPERVISER',
    MANAGER = 'MANAGER',
    SUPERADMIN = 'SUPERADMIN',
}
export const METADATA_KEYS = {
    CRONJOB: Symbol('cronSchedule'),
    FILE_UPLOAD_OPTIONS: Symbol('fileUploadOptions'),
    ABILITY: Symbol('ability')

}
export const RolesArray = Object.values(USER_ROLE);
export const LIFECYCLE_HOOKS_KEY = 'lifecycle:hooks';
export const PUBLIC_ROUTE_KEY = Symbol('publicRoute');
