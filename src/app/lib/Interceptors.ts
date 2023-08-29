import {Request, Response, NextFunction } from "express";

class Interceptor {
    constructor(public req: Request, public res: Response, public next: NextFunction) { }
}