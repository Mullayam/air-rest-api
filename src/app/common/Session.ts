import session from 'express-session'
import { Logging } from '@/logs';
import { __CONFIG__ } from '../config';
import helpers from '@/utils/helpers';
export class SessionHandler {

    static forRoot() {
        Logging.dev("Initializing App Session")
        return session(this.prototype._sessionOptions())
    }
    private _sessionOptions(): session.SessionOptions {
        return {
            genid: function (req: any) {
                return helpers.uuid_v4() // use UUIDs for session IDs
            },
            saveUninitialized: true,
            secret: __CONFIG__.SECRETS.SESSION_SECRET,
            proxy: true,
            resave: false,
            cookie: {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 * 7
            },

        }
    }
}