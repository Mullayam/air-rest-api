import type { Request, Response, NextFunction } from 'express'
import { FileHandler, ReadFilesPathOptions, UploadFilesReturn } from '../types'
import * as path from 'path'
import helpers from '../helpers'
import { Logging } from '@/logs'
import * as fs from 'fs'
import { StorageService } from '../services/StorageService'


const UploadFilesPath = path.join(process.cwd(), 'public', 'uploads')

class Storage {
    async forFeature(req: Request, res: Response, next: NextFunction) {
        let FilesArray: any = []
        try {

            if (!req.files || Object.keys(req.files).length === 0) {
                Logging.dev("No files found for upload.", "alert")
                return next()
            }
            const filetack = req.files.filetack as FileHandler[] | FileHandler

            if (Array.isArray(filetack)) {
                filetack.forEach((file: FileHandler) => {
                    const renameFile = file.name.replace(/\s+/g, '').trim()
                    file.mv(`${path.join(UploadFilesPath, renameFile)}`, async function (err: any) {
                        if (err) throw new Error(err)
                        const id = helpers.Md5Checksum(Date.now().toString())
                        const key = helpers.SimpleHash()
                        const extenstion = path.extname(file?.name)
                        const createInfo = { id, key, ...file, extenstion }
                        FilesArray.push(createInfo)
                        return next()
                    })
                })
            } else {
                const uploadedFile = req.files
                const inputKey = Object.keys(req.files)[0]
                const file = uploadedFile[inputKey] as FileHandler
                const renameFile = file.name.replace(/\s+/g, '').trim()
                file.mv(`${path.join(UploadFilesPath, renameFile)}`, async function (err: any) {
                    if (err) throw new Error(err)
                    const id = helpers.Md5Checksum(Date.now().toString())
                    const key = helpers.SimpleHash()
                    const extenstion = file.name.split('.')[1]
                    const createInfo = { id, key, ...file, extenstion }
                    FilesArray.push(createInfo)
                    return next()
                })
            }

        } catch (error: any) {
            return res.json({
                success: false,
                message: error.message,
                result: null
            })
        }
    }
    async UploadFiles(req: Request, uploadPath?: string): Promise<UploadFilesReturn> {
        let FilesArray: any = []
        try {
            const { aid } = req.session["user"]
            const uploadingPath = req.body.uploadingPath
            const remodifiedUploadingPath = uploadingPath.replace("/root", `/${aid}`)
            if (!(fs.existsSync(StorageService.createPath(remodifiedUploadingPath)))) {
                fs.mkdirSync(StorageService.createPath(remodifiedUploadingPath), { recursive: true })
            }
            if (!req.files || Object.keys(req.files).length === 0) {
                Logging.dev("No files found for upload.", "alert")
                return {
                    success: false,
                    message: "No files found for upload.",
                    result: null
                }
            }
            const filetack = req.files.filetack as FileHandler[] | FileHandler

            if (Array.isArray(filetack)) {
                filetack.forEach((file: FileHandler) => {
                    const renameFile = file.name.replace(/\s+/g, '').trim()
                    file.mv(`${path.join(UploadFilesPath, renameFile)}`, async function (err: any) {
                        if (err) throw new Error(err)
                        const id = helpers.Md5Checksum(Date.now().toString())
                        const key = helpers.SimpleHash()
                        const extenstion = path.extname(file?.name)
                        const createInfo = { id, key, ...file, extenstion }
                        FilesArray.push(createInfo)
                        return {
                            success: true,
                            message: "Files uploaded successfully",
                            result: FilesArray
                        }
                    })
                })
            } else {
                const uploadedFile = req.files
                const inputKey = Object.keys(req.files)[0]
                const file = uploadedFile[inputKey] as FileHandler

                const id = helpers.Md5Checksum(Date.now().toString())
                const key = helpers.SimpleHash()

                const modifiedUploadPath = path.join(UploadFilesPath, remodifiedUploadingPath)
                const fileContent = JSON.parse(StorageService.readFileWithContent(["fileDatabase.json"], { encoding: 'utf8', flag: 'r' }))
                const extenstion = path.extname(file.name)
                const renameFile = `${key}${extenstion}`

                fileContent[aid] = {
                    ...fileContent[aid],
                    [id]: { filename: renameFile, diskPath: modifiedUploadPath }
                }
                StorageService.writeFileContent(["fileDatabase.json"], fileContent, { encoding: 'utf8', flag: 'w' })

                file.mv(`${path.join(modifiedUploadPath, renameFile)}`, async function (err: any) {
                    if (err) throw new Error(err)
                    const createInfo = { id, key, ...file, extenstion, renameFile, modifiedUploadPath }
                    FilesArray.push(createInfo)
                    return {
                        success: true,
                        message: "File uploaded successfully",
                        result: FilesArray
                    }
                })
            }
            return {
                success: true,
                message: "File uploaded successfully",
                result: FilesArray
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.message,
                result: null
            }
        }
    }
    async DownloadFile(req: Request, res: Response) {

        try {
            const DownloadPath = path.join(process.cwd(), "public", "uploads",);
            res.download(DownloadPath, (error: any) => { if (error) throw new Error(error); });
            return res.json({
                success: true,
                message: "DownloadFile",
                result: null
            })

        } catch (error: any) {
            return res.json({
                success: false,
                message: "Unable to Download File : " + error.message,
                result: null
            })

        }
    }
}
export default new Storage()