import { DataSource } from 'typeorm'
// import { Entities } from './factory/ReadEntities.js'

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    database: process.env.DB_NAME as string,    
    synchronize: true,
    logging: false,    
    // entities: Entities,
    // subscribers: [],
    // migrations: ["./factory/migrations/*{.ts,.js}"],
})