import "dotenv/config";
import "reflect-metadata";
import { register } from "tsconfig-paths";
import tsConfig from "../tsconfig.json";
register({ baseUrl: __dirname, paths: tsConfig.compilerOptions.paths });
import { bootstrap } from "./application";
function main() {	
	const app = bootstrap.AppServer.InitailizeApplication()!;
}

main();
