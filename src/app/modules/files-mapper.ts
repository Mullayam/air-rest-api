import * as fs from 'fs'
import path from "path"
import { Type } from '@/utils/types'

type T = "controller" | "entity" | "service" | "middleware" | "migrations"
export class FilesMapper {
    static forRoot<K>(pathName: string, type: "default" | "special" = "default"): Type[] | any {
        const __workingDir = path.join(process.cwd(), pathName)
        let modules: any = [];
        const result = fs.readdirSync(__workingDir)
            .filter((file) => file.startsWith('index') === false)
            .filter((file) => (path.extname(file) === '.js') || (file !== '.ts') && !file.endsWith('.d.ts'))
            .filter((file) => file.indexOf(".spec") === -1 && file.indexOf(".test") === -1)
        if (type === "default") {
            modules = result.map((file) => require(`${__workingDir}/${file}`).default as any)
            return modules
        }
        if (type === "special") {
            result.forEach((file) => {
                const module = require(`${__workingDir}/${file}`) as any
                for (const key in module) {
                    // Check if the key is a function
                    if (typeof module[key] === 'function') {
                        modules.push(module[key])
                    }
                }
            })
            return modules
        }


    }
    static forFeature<K>(pathName: string, basename: T & K): Type[] | any {
        const __workingDir = path.join(process.cwd(), pathName)
        return fs.readdirSync(__workingDir)
            .filter((file) => file.startsWith('index') === false)
            .filter((file) => (path.extname(file) === '.js') || (file !== '.ts') && !file.endsWith('.d.ts'))
            .filter((file) => file.indexOf(".spec") === -1 && file.indexOf(".test") === -1)
            .map((file) => require(`${__workingDir}/${file}`).default as any)
    }

}