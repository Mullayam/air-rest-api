const APP_ENV = String(process.env.APP_ENV) || "DEV";
const APP_PORT = Number(process.env.APP_PORT) || 7654;
const APP_DOMAIN = String(process.env.APP_DOMAIN) || "localhost";
const __config = {
	APP: {
		APP_PORT,
		APP_ENV,
		API_VERSION: String(process.env.API_VERSION),
		APP_DOMAIN,
		APP_URL:
			APP_ENV === "DEV" || APP_ENV === "undefined"
				? `http://localhost:${APP_PORT}`
				: `https://${APP_DOMAIN}`,
		API_KEY: String(process.env.API_KEY),
		ALLOWED_PRIMARY_DOMAINS: String(process.env.ALLOWED_PRIMARY_DOMAINS),
		MAIL_TEMPLATE_PATH: String(process.env.MAIL_TEMPLATE_PATH),
	},
	SECRETS: {
		SALT: String(process.env.SALT),
		JWT_SECRET_TOKEN: String(process.env.JWT_SECRET_TOKEN),
		APP_SECRET: String(process.env.APP_SECRET),
		COOKIE_SECRET: String(process.env.COOKIE_SECRET),
		SESSION_SECRET: String(process.env.SESSION_SECRET),
	},
	DATABASE: {
		DB_DIALECT: String(process.env.DB_DIALECT) || "postgres",
		DATABASE_URL: String(process.env.DATABASE_URL),
		DB_NAME: String(process.env.DB_NAME),
		DB_HOST: String(process.env.DB_HOST),
		DB_USER: String(process.env.DB_USER),
		DB_PASS: String(process.env.DB_PASS),
		DB_PORT: Number(process.env.DB_PORT) || 5432,
	},
	SMTP_SETTINGS: {
		SMTP_HOST: String(process.env.SMTP_HOST),
		SMTP_TYPE: String(process.env.SMTP_TYPE) || "SSL",
		SMTP_HOST_PORT: Number(process.env.SMTP_HOST_PORT) || 465,
		SMTP_HOST_USER: String(process.env.SMTP_HOST_USER),
		SMTP_HOST_PASS: String(process.env.SMTP_HOST_PASS),
		SMTP_SENDER_NAME: String(process.env.SMTP_SENDER_NAME),
	},
	CACHE: {
		CACHE_ENBALED: String(process.env.CACHE_ENBALED),
		CACHE_HOST: String(process.env.CACHE_HOST),
		CACHE_PORT: Number(process.env.PORT) || 6379,
	},
};
export const ConfigService = {
	/**
	 * A function that retrieves a value from the config based on the provided key.
	 *
	 * @param {keyof typeof __config} key - the key of the config to retrieve the value from
	 * @return {typeof __config[key]} the value associated with the key in the config
	 */
	get: (key: keyof typeof __config) => {
		const value = __config[key];
		if (!value) {
			throw new Error(`Missing config: ${key}`);
		}
		return value as (typeof __config)[typeof key];
	},
};

export const __CONFIG__ = Object.freeze(__config);
