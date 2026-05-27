import "dotenv/config";
import "reflect-metadata";
import { bootstrap } from "./application";

function main() {
	const _app = bootstrap.AppServer.InitailizeApplication()!;
}

main();
