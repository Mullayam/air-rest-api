import "dotenv/config";
import "reflect-metadata";
import { bootstrap } from "./application";

function main() {
	const app = bootstrap.AppServer.InitailizeApplication()!;
}

main();
