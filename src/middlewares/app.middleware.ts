import Helpers from "@/utils/helpers";
import { Request, Response, NextFunction } from "express";

export class AppMiddlewares {

  //  check api key from frontend is valid or not
  public static isApiProtected(req: Request, res: Response, next: NextFunction) {
    try {       
      const headers = req.headers;
      const apiKey = headers["api_key"] || undefined;
      if (typeof apiKey === "undefined") {
        return res.status(404).json({
          success: false,
          result: {
            code: 404
          },
          message: "API_KEY is Required",
        });
      }
      if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({
          success: false,
          status_code: {
            code: 412
          },
          message: "Invalid KEY, Check API KEY",
        });
      }
      next();
    } catch (error: any) {
      res.send({
        success: false,
        result: null,
        message: error.message,
      });
      res.end();
    }

  }
  /**
   * Sets the X-Request-Id and X-Platform headers in the request and response objects.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next function in the middleware chain.
   */
  public static IRequestHeaders(req: Request, res: Response, next: NextFunction) {
    const requestId = Helpers.RequestId();
    req.headers['X-Request-Id'] = requestId;
    res.setHeader('X-Request-Id', requestId);
    res.setHeader('X-Platform', "Cozinco Innovations");
    next();
  }
}