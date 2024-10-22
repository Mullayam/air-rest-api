import { Response, NextFunction, Request } from "express";

export function useHttpsRedirection(req: Request, res: Response, next: NextFunction) {
    if (req.get("X-Forwarded-Proto") == "http") {
        res.redirect("https://" + req.headers.host + req.url);
    } else {
        next();
    }
};