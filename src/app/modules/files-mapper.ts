import * as fs from 'fs'
import path from "path"
import { pathToFileURL } from 'url';
import { globSync } from 'glob';

import { Type } from '@/utils/interfaces'

type T = "controller" | "entity" | "service" | "middleware" | "migrations"
export class FilesMapper {
    private static extractExports(importedModule: any): any[] {
        return Object.values(importedModule).filter(exp => typeof exp === 'function');
    }

    private static async getFilesRecursively(directory: string): Promise<string[]> {
        const entries = await fs.promises.readdir(directory, { withFileTypes: true });
        const files = entries.map(entry => {
            const res = path.resolve(directory, entry.name);
            return entry.isDirectory() ? this.getFilesRecursively(res) : Promise.resolve(res);
        });
        return Array.prototype.concat(...(await Promise.all(files)));
    }
     /**
     * Asynchronously imports modules from the given path.
     *
     * @param {string} path - The path to the modules to import. Can contain glob patterns  ./src/*.{ts,js} .      
     * @return {Promise<any[]>} A promise that resolves to an array of imported modules.
     */
    static async _importModules(path: string): Promise<any[]> {
        const files = path.includes('*') ? globSync(path) : await this.getFilesRecursively(path)
        const modules: any[] = [];
        for (const file of files) {
            if (file.endsWith('.ts') || file.endsWith('.js') &&  !file.endsWith('.d.ts')  && !file.endsWith('.test.ts') && !file.endsWith('.spec.ts')) {
                try {
                    const moduleUrl = pathToFileURL(file).href;
                    const importedModule = await import(moduleUrl);
                    modules.push(...this.extractExports(importedModule));
                } catch (error) {
                    console.error(`Failed to import module: ${file}`, error);
                }
            }
        }
        return modules;
    }

    /**
     * A funtion to import modules only from directories
     *
     * @param {string} pathName - path to the file
     * @param {"default" | "special"} [type="default"] - description of parameter
     * @return {Type[] | any} description of return value
     */
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
    /**
     * A funtion to import modules like "controller" | "entity" | "service" | "middleware" | "migrations"
     *
     * @param {string} pathName - path to modules    
     * @return {Type[] | any} description of return value
     */
    static forFeature<K>(pathName: string): Type[] | any {
        const __workingDir = path.join(process.cwd(), pathName)
        return fs.readdirSync(__workingDir)
            .filter((file) => file.startsWith('index') === false)
            .filter((file) => (path.extname(file) === '.js') || (file !== '.ts') && !file.endsWith('.d.ts'))
            .filter((file) => file.indexOf(".spec") === -1 && file.indexOf(".test") === -1)
            .map((file) => require(`${__workingDir}/${file}`).default as any)
    }
   
}