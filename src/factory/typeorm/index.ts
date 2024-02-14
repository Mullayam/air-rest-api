import { AppDataSource } from "@/app/config/Datasource"
import { Logging } from "@/logs"
import { EntityTarget, ObjectLiteral } from 'typeorm'

export const customRepository = <T>(repo: EntityTarget<T extends ObjectLiteral ? T : ObjectLiteral>) => AppDataSource.getRepository(repo)
export const createConnection = () => AppDataSource.initialize().then(async () => Logging.dev("Database Connected"))
.catch(error => {
    console.log(error)
    process.exit(1)
})
