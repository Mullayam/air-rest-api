import { DataSource } from "typeorm";
import { __CONFIG__ } from ".";

const DBURL = {
	url: `postgres://${__CONFIG__.DATABASE.DB_USER}:${__CONFIG__.DATABASE.DB_PASS}@${__CONFIG__.DATABASE.DB_HOST}:${+__CONFIG__.DATABASE.DB_PORT}/${__CONFIG__.DATABASE.DB_NAME}`,
};
const DB_OPTIONS = {
	host: __CONFIG__.DATABASE.DB_HOST || "localhost",
	port: +__CONFIG__.DATABASE.DB_PORT,
	username: __CONFIG__.DATABASE.DB_USER,
	password: __CONFIG__.DATABASE.DB_PASS,
	database: __CONFIG__.DATABASE.DB_NAME,
};
const DB =
	__CONFIG__.DATABASE.DATABASE_URL === "undefined" ? DBURL : DB_OPTIONS;
export const AppDataSource = new DataSource({
	...DB,
	type: "postgres",
	synchronize: __CONFIG__.APP.APP_ENV === "DEV",
	logging: false,
	entities: ["build/factory/entities/**/*.entity.js}"],
	subscribers: [],
	migrationsRun: __CONFIG__.APP.APP_ENV === "DEV",
	migrations: ["build/factory/migrations/**/*.js"],
	migrationsTableName: "migration_table",
	ssl: false,
	extra: {
		ssl: {
			rejectUnauthorized: false,
		},
	},
});
