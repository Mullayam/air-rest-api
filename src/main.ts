import "dotenv/config"
import "reflect-metadata"
import tsConfig from '../tsconfig.json'
import { register } from 'tsconfig-paths'
register({ baseUrl: __dirname, paths: tsConfig.compilerOptions.paths })
import { bootstrap } from "./application";
function main() {
    const app = bootstrap.AppServer.InitailizeApplication()!
   
}

main()