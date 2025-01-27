export type AuthProvidersList = "google" | "facebook" | "github";
export type RepoProvidersList = "gitlab" | "bitbucket" | "github";

export interface IAuthProvider {
	getAuthUrl(): string;
	handleCallback<T>(code: string): Promise<T>;
	refreshToken<T>(refresh_token: string): Promise<T>;
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

export interface GoogleAuthProviderResponse {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	token_type: string;
	id_token: string;
}
export interface ID_TOKEN {
	iss: string;
	azp: string;
	aud: string;
	sub: string;
	email: string;
	email_verified: boolean;
	at_hash: string;
	name: string;
	picture: string;
	given_name: string;
	family_name: string;
	iat: number;
	exp: number;
}
