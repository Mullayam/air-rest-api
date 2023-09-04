import { Application, Request, Response, NextFunction } from "express";

import { Logging } from "../../logs/index.js";
import { HttpException } from "./ExceptionHandler.js";
import { InterceptorsSettings } from "../../types/index.js";

const ORIGINAL_RESPONSE = { response: { info: "Interceptor Response" } }
export class Interceptor {
    private static app: Application
    private myResponse: Record<string, any>;
    constructor(private app: Application, private settings: InterceptorsSettings) {
        Interceptor.app = app
        this.myResponse = settings.response
        if (settings.isEnable) {
            this.InterceptResponse()
        }
    }
    private InterceptResponse() {
        const _this = this
        Logging.alert("Response is using Interceptor")
        Interceptor.app.use(function (req: Request, res: Response, next: NextFunction) {
            try {
                const oldJSON = res.json;
                res.json = (data) => {
                    if (data && data.then != undefined) {
                        return data.then((resData: any) => {
                            res.json = oldJSON;

                            return oldJSON.call(res, resData);
                        }).catch((error: any) => {
                            next(error);
                        });
                    } else {
                        data = Object.assign(data, _this.myResponse);
                        return oldJSON.call(res, data);
                    }
                }
                next()
            } catch (error) {
                throw new HttpException({ name: "PAYLOAD_TOO_LARGE", message: "Something Went Wrong with Intercepting the Response", stack: error })
            }
        })
    }


    public static useInterceptors(app: Application, settings: { response: Record<string, any>, isEnable?: boolean } = { ...ORIGINAL_RESPONSE, isEnable: false }) {
        if (!Interceptor.app) {
            new Interceptor(app, settings)
            return this
        }
        return this
    }
}