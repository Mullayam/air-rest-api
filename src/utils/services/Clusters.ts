import cluster from "node:cluster";
import * as os from "node:os";
import { Logging } from "@/logs";

const clusterWorkerSize = os.cpus().length;
export class Clusters {
	/**
	 * Workers function that handles running the application in a clustered environment.
	 *
	 * @param {() => void} RunApplication - The function to run the application.
	 */
	Workers(RunApplication: () => void) {
		if (
			process.env.APP_ENV === "PRODUCTION" &&
			process.env.CLUSTERS === "true"
		) {
			if (cluster.isPrimary) {
				Logging.dev(`Main Instance ${process.pid} is running`);
				// Fork workers.
				for (let i = 0; i < clusterWorkerSize; i++) {
					cluster.fork();
				}
				cluster.on("exit", (worker, code, signal) => {
					const msg = `Worker ${worker.id} has exited with signal ${signal}`;
					Logging.alert(msg);
					if (code !== 0 && !worker.exitedAfterDisconnect) {
						cluster.fork();
					}
				});
			} else {
				RunApplication();
			}
		}
	}
}
