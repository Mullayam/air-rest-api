import { join } from "path"
import { ReadFilesPathOptions, StorageType } from "../types"
import * as fs from 'fs'

let IN_MEMORY_STORAGE = new Map()

export class StorageService {
    constructor(private storageType: StorageType = "Disk") {

    }
    static initDiskStorage() {
        const FilePath = join(process.cwd(), 'public', 'data', 'fileDatabase.json')
        if (!(fs.existsSync(FilePath))) {
            fs.writeFileSync(FilePath, JSON.stringify({}, null, 4),)
        }
    }
    static createPath(...givenPath: string[]) {
        const generatedPath = join(process.cwd(), 'public', 'uploads', ...givenPath)
        return generatedPath
    }
    static readFileWithContent(givenPath: string[] , options: ReadFilesPathOptions) {
        const FilePath = join(process.cwd(), 'public', 'data', ...givenPath)
        const ReadFileContent = fs.readFileSync(FilePath, options);
        return ReadFileContent
    }
    static  writeFileContent(givenPath: string[], data: any, options: ReadFilesPathOptions) {
        const FilePath = join(process.cwd(), 'public', 'data', ...givenPath)
        try {
            fs.writeFileSync(FilePath, JSON.stringify(data, null, 4),options)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
    static initMemoryStorage() {

    }
    static setStorageType(storageType: StorageType) {

    }
    get(key: string) {
        return JSON.parse(IN_MEMORY_STORAGE.get(key))
    }
    set(key: string, value: string) {
        return IN_MEMORY_STORAGE.set(key, JSON.stringify(value, null, 4))
    }
    remove(key: string) {
        return IN_MEMORY_STORAGE.delete(key)
    }
    size() {
        return IN_MEMORY_STORAGE.size
    }
    destroyAll() {
        return IN_MEMORY_STORAGE.clear()
    }
}