import { AbstractOAuth2Provider } from "../abstract";

import { google } from "googleapis";

export class GoogleAuthProvider extends AbstractOAuth2Provider {
    getAuthUrl(): string {
        const scopes = [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ]
        const oauth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUri);
        const googleURL = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scopes,
        });
        return googleURL;
    }

    async handleCallback<T>(code: string): Promise<T> {
        // Example logic for handling OAuth2 callback
        const response = await fetch("https://oauth2.googleapis.com/token", {
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
        return data as T; // Cast the response to a generic type
    }
}
