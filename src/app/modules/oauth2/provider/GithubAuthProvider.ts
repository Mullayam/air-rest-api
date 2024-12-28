import { AbstractOAuth2Provider } from "../abstract";

export class GithubAuthProvider extends AbstractOAuth2Provider {
    getAuthUrl(): string {
        const baseUrl = "https://github.com/login/oauth/authorize";
        const scope = "repo";
        return `${baseUrl}?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=${scope}`;
    }

    async handleCallback<T>(code: string): Promise<T> {
        const response = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code,
                redirect_uri: this.redirectUri,
                grant_type: "authorization_code",
            }),
        });

        const data = await response.json();
        return data as T;
    }
    async refreshToken<T>(refresh_token: string): Promise<T> {
        const queryString = `client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=refresh_token&refresh_token=${refresh_token}`
        const response = await fetch("https://github.com/login/oauth/access_token?" + queryString, {
            method: "GET",
        });
        const data = await response.json();
        return data as T;
    }
}
