import { Response as ExpressResponse } from "express";


export class AirResponse {
    static JSON(res: ExpressResponse, response: any, code: number = 200): void {
        res.status(code).json(response);
    }
    static Message(res: ExpressResponse, response: any, code: number = 200): void {
        res.status(code).send(response)
    }

}