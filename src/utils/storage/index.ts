import type { Request, Response, NextFunction } from 'express'
import { FileHandler } from '../types'
import * as path from 'path'
import helpers from '../helpers'
import { Logging } from '@/logs'

const UploadFilesPath = path.join(process.cwd(), 'public', 'uploads')
export class Storage {
    async UploadFiles(req: Request, res: Response, next: NextFunction) {
        let FilesArray: any = []
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                Logging.dev("No files found for upload.", "info")
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
                        const extenstion = file.name.split('.')[1]
                        const createInfo = { id, key, ...file, extenstion }
                        FilesArray.push(createInfo)
                        return next(FilesArray)
                    })
                })
            } else {

                const renameFile = filetack.name.replace(/\s+/g, '').trim()
                filetack.mv(`${path.join(UploadFilesPath, renameFile)}`, async function (err: any) {
                    if (err) throw new Error(err)
                    const id = helpers.Md5Checksum(Date.now().toString())
                    const key = helpers.SimpleHash()
                    const extenstion = filetack.name.split('.')[1]
                    const createInfo = { id, key, ...filetack, extenstion }
                    FilesArray.push(createInfo)
                    return next(FilesArray)
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