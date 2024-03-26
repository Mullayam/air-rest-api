import { AppDataSource } from "@/app/config/Datasource"
import { Logging } from "@/logs"
import { EntityTarget, ObjectLiteral } from 'typeorm'

export const InjectRepository = <T>(repo: EntityTarget<T extends ObjectLiteral ? T : ObjectLiteral>) => AppDataSource.getRepository(repo)
export const createConnection = () => AppDataSource.initialize().then(async () => Logging.dev("Database Connected"))
.catch(error => {
    Logging.dev(error,"error")
    process.exit(1)
})
