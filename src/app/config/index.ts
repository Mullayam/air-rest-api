const APP_PORT = Number(process.env.APP_PORT) || 7134
const APP_ENV = String(process.env.APP_ENV) || "DEV"
const APP_DOMAIN = String(process.env.APP_DOMAIN) || "localhost"
export const CONFIG = {
    APP: {
        APP_PORT,
        APP_ENV,
        APP_DOMAIN,
        APP_URL: APP_ENV === "DEV" ? `http://localhost:${APP_PORT}` : `https://${APP_DOMAIN}`,
        API_KEY: String(process.env.API_KEY),
        ALLOWED_PRIMARY_DOMAINS: String(process.env.ALLOWED_PRIMARY_DOMAINS),
        MAIL_TEMPLATE_PATH: String(process.env.MAIL_TEMPLATE_PATH),
    },
    SECRETS: {
        SALT: String(process.env.SALT),
        JWT_SECRET_KEY: String(process.env.JWT_SECRET_KEY),
        APP_SECRET: String(process.env.APP_SECRET),
        COOKIE_SECRET: String(process.env.COOKIE_SECRET),
        SESSION_SECRET: String(process.env.SESSION_SECRET),
    },
    DATABASE: {
        DB_NAME: String(process.env.DB_NAME),
        DB_HOST: String(process.env.DB_HOST),
        DB_USER: String(process.env.DB_USER),
        DB_PASS: String(process.env.DB_PASS),
        DB_PORT: Number(process.env.DB_PORT) || 5432,
    },
    MAIL_SETTINGS: {
        SMTP_HOST: String(process.env.SMTP_HOST),
        SMTP_HOST_USER: String(process.env.SMTP_HOST_USER),
        SMTP_HOST_PASS: String(process.env.SMTP_HOST_PASS),
        SMTP_HOST_PORT: Number(process.env.SMTP_HOST_PORT) || 465,
        SMTP_TYPE: String(process.env.SMTP_TYPE),
    },
    CACHE: {
        CACHE_ENBALED: String(process.env.CACHE_ENBALED),
        CACHE_HOST: String(process.env.CACHE_HOST),
        CACHE_PORT: Number(process.env.PORT) || 6379,
    },
    PROVIDERS: {
        GOOGLE: {
            GOOGLE_CLIENT_ID: String(process.env.GOOGLE_CLIENT_ID),
            GOOGLE_CLIENT_SECRET: String(process.env.GOOGLE_CLIENT_SECRET),
            GOOGLE_CALLBACK_URL: String(process.env.GOOGLE_CALLBACK_URL),
        },
    },
};