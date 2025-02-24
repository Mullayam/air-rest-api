import * as fs from "node:fs";
import * as path from "node:path";
import { Logging } from "@/logs";
import helpers from "@utils/helpers";
import type { FileUploadInfo } from "@utils/types";
import type {
	FileHandler,
	FileUploadOptions,
} from "@utils/types/fileupload.interface";
import type { NextFunction, Request, Response } from "express";

const UploadFilesPath = helpers.createPath("public/train-data");
export class Storage {
	UploadFiles({
		fieldName,
		uploadDirPath = UploadFilesPath,
		hasMultipleFiles,
	}: FileUploadOptions) {
		return async (req: Request, res: Response, next: NextFunction) => {
			const FilesArray: FileUploadInfo[] = [];
			try {
				if (!req.files || Object.keys(req.files).length === 0) {
					Logging.dev("No files found for upload.", "error");
					return next();
				}
				uploadDirPath = helpers.createPath(uploadDirPath);
				fs.mkdirSync(uploadDirPath, { recursive: true });
				if (hasMultipleFiles && Object.keys(req.files).length) {
					const filetack = req.files as unknown as FileHandler[];
					for (const fieldName in filetack) {
						const renameFile = filetack[fieldName].name
							.replace(/\s+/g, "")
							.trim();
						filetack[fieldName].mv(
							`${path.join(uploadDirPath, renameFile)}`,
							async (err: any) => {
								if (err) throw new Error(err);
								const id = helpers.Md5Checksum(Date.now().toString());
								const key = helpers.SimpleHash();
								const extenstion = filetack[fieldName].name.split(".")[1];
								const createInfo = {
									id,
									key,
									...filetack[fieldName],
									extenstion,
								};
								FilesArray.push(createInfo);
								// req.body.uploadedFiles = FilesArray
								return next();
							},
						);
					}
				} else {
					if (Object.keys(req.files).length !== 1) {
						throw new Error(
							"1 or more files found for upload. but allowed only 1",
						);
					}
					const singleFiletack = req.files[fieldName!] as FileHandler;
					const renameFile = singleFiletack.name.replace(/\s+/g, "").trim();
					singleFiletack.mv(
						`${path.join(uploadDirPath, renameFile)}`,
						async (err: any) => {
							if (err) throw new Error(err);
							const id = helpers.Md5Checksum(Date.now().toString());
							const key = helpers.SimpleHash();
							const extenstion = singleFiletack.name.split(".")[1];
							const createInfo = { id, key, ...singleFiletack, extenstion };
							FilesArray.push(createInfo);
							req.body.uploadedFiles = FilesArray;
							return next();
						},
					);
				}
			} catch (error: any) {
				return res.json({
					success: false,
					message: error.message,
					result: null,
				});
			}
		};
	}

	async DownloadFile(req: Request, res: Response) {
		try {
			const DownloadPath = path.join(process.cwd(), "public", "uploads");
			res.download(DownloadPath, (error: any) => {
				if (error) throw new Error(error);
			});
			return res.json({
				success: true,
				message: "DownloadFile",
				result: null,
			});
		} catch (error: any) {
			return res.json({
				success: false,
				message: `Unable to Download File : ${error.message}`,
				result: null,
			});
		}
	}
}
