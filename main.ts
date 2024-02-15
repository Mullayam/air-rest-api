import "dotenv/config"
import "reflect-metadata"
import tsConfig from './tsconfig.json'
import { register } from 'tsconfig-paths'
register({ baseUrl: __dirname, paths: tsConfig.compilerOptions.paths })
import { AppServer } from "./src/application";
new AppServer().InitailizeApplication()