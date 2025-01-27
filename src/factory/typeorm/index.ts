import { AppDataSource } from "@/app/config/Datasource";
import { Logging } from "@/logs";
import type { EntityTarget, ObjectLiteral, Repository } from "typeorm";

export const InjectRepository = <T extends ObjectLiteral>(
	repository: EntityTarget<T extends ObjectLiteral ? T : ObjectLiteral>,
): Repository<T extends ObjectLiteral ? T : ObjectLiteral> =>
	AppDataSource.getRepository(repository);
export const CloseConnection = () => AppDataSource.destroy();
export const CreateConnection = () =>
	AppDataSource.initialize()
		.then(async () => Logging.dev("Database Connected"))
		.catch((error) => {
			Logging.dev(error, "error");
			process.exit(1);
		});
