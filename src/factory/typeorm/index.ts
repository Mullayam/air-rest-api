import {  EntityTarget, ObjectLiteral, Repository } from 'typeorm'
import { AppDataSource } from "@/app/config/Datasource"
import { Logging } from "@/logs"

export const InjectRepository = <T extends ObjectLiteral> (repository: EntityTarget<T extends ObjectLiteral ? T : ObjectLiteral>): Repository<T extends ObjectLiteral ? T : ObjectLiteral> => AppDataSource.getRepository(repository)

export const CreateConnection = () => AppDataSource.initialize().then(async () => Logging.dev("Database Connected")).catch(error => {
    Logging.dev(error, "error")
    process.exit(1)
})