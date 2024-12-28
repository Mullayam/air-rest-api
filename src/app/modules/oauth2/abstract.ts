import { IAuthProvider } from "@/utils/interfaces/provider.interface";

export abstract class AbstractOAuth2Provider implements IAuthProvider {
    protected clientId: string; // Made protected for access in subclasses
    protected clientSecret: string; // Made protected for subclass access
    protected redirectUri: string; // Made protected for subclass access

    constructor(clientId: string, clientSecret: string, redirectUri: string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
    }

    abstract getAuthUrl(): string;

    abstract handleCallback<T>(code: string): Promise<T>;

    abstract refreshToken<T>(code: string): Promise<T>;
}