import { DatabaseType, DataSource } from 'typeorm'
import { CONFIG } from '.'
const DBURL = { url: `postgres://${CONFIG.DATABASE.DB_USER}:${CONFIG.DATABASE.DB_PASS}@${CONFIG.DATABASE.DB_HOST}:${+CONFIG.DATABASE.DB_PORT}/${CONFIG.DATABASE.DB_NAME}` }
const DB_OPTIONS = {
    host: CONFIG.DATABASE.DB_HOST || "localhost",
    port: +CONFIG.DATABASE.DB_HOST,
    username: CONFIG.DATABASE.DB_USER,
    password: CONFIG.DATABASE.DB_PASS,
    database: CONFIG.DATABASE.DB_NAME,
}
const DB = CONFIG.DATABASE.DATABASE_URL === "undefined" ? DBURL : DB_OPTIONS
export const AppDataSource = new DataSource({
    ...DB,
    type: "postgres",
    synchronize: CONFIG.APP.APP_ENV === "DEV" ? true : false,
    logging: false,
    entities: ["src/factory/entities/**/*.entity{.ts,.js}"],
    subscribers: [],
    migrationsRun: CONFIG.APP.APP_ENV === "DEV" ? true : false,
    migrations: ["src/factory/migrations/**/*{.ts,.js}"],
    migrationsTableName: "migration_table",
    ssl: false,
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})
