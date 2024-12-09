import { AbstractOAuth2Provider } from "../abstract";

export class GithuAuthProvider extends AbstractOAuth2Provider {
    getAuthUrl(): string {
        throw new Error("Method not implemented.");
    }

    async handleCallback<T>(code: string): Promise<T> {
        throw new Error("Method not implemented.");
    }

}
