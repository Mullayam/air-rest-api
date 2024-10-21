import os from 'os'
import fs from 'fs'
import path from 'path'
import { extension } from 'mime-types'
import { FileMagic, MagicFlags } from '@npcz/magic'
FileMagic.magicFile = require.resolve('@npcz/magic/dist/magic.mgc')

if (
    process.platform === 'darwin' ||
    process.platform === 'linux'
) {
    FileMagic.defaultFlags = MagicFlags.MAGIC_PRESERVE_ATIME
}
class FileValidator {
    getMagic = async () => {
        const instance = await FileMagic.getInstance()
        return instance
    }

    getMimeType = async (
        dataOrFilePath: Buffer | string
    ) => {
        let filePath = ''
        if (typeof dataOrFilePath === 'string') {
            filePath = dataOrFilePath
        } else if (dataOrFilePath instanceof Buffer) {
            const fileId = Math.random().toString(36).substring(7)

            const tempPath = path.join(os.tmpdir(), fileId)

            fs.writeFileSync(tempPath, dataOrFilePath)

            filePath = tempPath
        }

        if (!fs.existsSync(filePath)) {
            throw new Error('[libmagic] File not found')
        }

        const magic = await this.getMagic()
        const mimeType = magic.detectMimeType(filePath)
        return mimeType
    }

    validateMimeType = async (
        dataOrFilePath: Buffer | string,
        allowedMimeTypes: string[]
    ): Promise<{
        isValid: boolean
        mimeType: string
        allowedMimeTypes: string[]
    }> => {
        let filePath = ''
        if (typeof dataOrFilePath === 'string') {
            filePath = dataOrFilePath
        } else if (dataOrFilePath instanceof Buffer) {
            const fileId = Math.random().toString(36).substring(7)

            const tempPath = path.join(os.tmpdir(), fileId)

            fs.writeFileSync(tempPath, dataOrFilePath)

            filePath = tempPath
        }

        const mimeType = await this.getMimeType(filePath)
        const isValid = allowedMimeTypes.includes(mimeType)

        if (dataOrFilePath instanceof Buffer) {
            fs.unlinkSync(filePath)
        }

        return { isValid, mimeType, allowedMimeTypes }
    }

    getExtension = async (
        dataOrMimeType: Buffer | string
    ) => {
        let mimeType = ''

        if (typeof dataOrMimeType === 'string') {
            mimeType = dataOrMimeType
        } else if (dataOrMimeType instanceof Buffer) {
            mimeType = await this.getMimeType(dataOrMimeType)
        }

        return extension(mimeType)
    }
}




export default new FileValidator()