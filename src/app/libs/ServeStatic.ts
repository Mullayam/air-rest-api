import { join } from "path";
import express from 'express';
import * as serveStatic from "serve-static";
import { pathToRegexp } from "path-to-regexp"
import type { Application, NextFunction, Request, Response } from "express";
type Options = {
    rootPath?: string
    exclude?: string[];
    urlPath?: string
    staticOptions?: serveStatic.ServeStaticOptions
}


export class ServeStaticModule {

    private static isRouteExcluded(req: Request, paths: string[]) {
        return paths.some((path) => {
            const re = pathToRegexp(path);
            const queryParamsIndex = req.originalUrl.indexOf('?');
            const pathName = queryParamsIndex >= 0 ? req.url.slice(0, queryParamsIndex) : req.originalUrl;

            if (!re.regexp.exec(pathName)) {
                return false
            }
            return true
        })
    }
    /**
     * Exposes the specified directory as a static asset directory.
     *  Specially use for  React Application to handle routing.
     * @param {Application} app - The Express application instance.
     * @param {Options} options - The options for serving static files.
     */
    static expose(app: Application, options: Options = {}) {
        const rootPath = options?.rootPath || join(process.cwd(), 'public')
        const indexFile = join(rootPath, 'index.html')
        options.urlPath = options?.urlPath || '*'
        options.exclude = options.exclude || []
        const renderFile = (req: Request, res: Response, next: NextFunction) => {
            if (!this.isRouteExcluded(req, options.exclude!)) res.sendFile(indexFile);
            else next();
        }
        app.use(express.static(rootPath,))
        app.get(options.urlPath, renderFile)
    }
}