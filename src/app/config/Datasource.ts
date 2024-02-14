import { DataSource } from 'typeorm'
import { Entities } from '@/factory/ReadEntities'
import { Migrations } from '@/factory/migrations'
import { CONFIG } from '.'
export const AppDataSource = new DataSource({
    type: "postgres",
    host: CONFIG.DATABASE.DB_HOST || "localhost",
    port: +CONFIG.DATABASE.DB_HOST,
    username: CONFIG.DATABASE.DB_USER,
    password: CONFIG.DATABASE.DB_PASS,
    database: CONFIG.DATABASE.DB_NAME,
    synchronize: CONFIG.APP.APP_ENV === "DEV" ? true : false,
    logging: false,
    entities: Entities.length > 0 ? Entities : [],
    subscribers: [],
    migrationsRun: CONFIG.APP.APP_ENV === "DEV" ? true : false,
    migrations: Migrations.length > 0 ? Migrations : [],
    migrationsTableName: "migration_table",
    ssl: false,
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})
