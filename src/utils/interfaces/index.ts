export function PartialType<T>(BaseClass: new () => T): new () => Partial<T> {
    abstract class PartialClassType { }
    Object.assign(PartialClassType.prototype, BaseClass.prototype);
    return PartialClassType as new () => Partial<T>;
}

export type AuthProviders = {
    [key in AuthProvidersList]: AuthProvidersKeys;
};
export type AuthProvidersScopes = {
    [key in AuthProvidersList]: string[];
};
export interface AuthProvidersKeys {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}
export type AuthProvidersList = "google" | "facebook" | "github";
