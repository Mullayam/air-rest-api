import "dotenv/config"
import "reflect-metadata"
import { register } from 'tsconfig-paths'
import tsConfig from './tsconfig.json'
register({ baseUrl: __dirname, paths: tsConfig.compilerOptions.paths })
import { AppServer } from "./src/application";
new AppServer().InitailizeApplication()