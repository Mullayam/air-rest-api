import { Logging } from "@/logs";
import Helpers, { SetAppRoutes } from "@/utils/helpers";
import { Security } from "@/utils/helpers/security";
import { Request, Response, NextFunction } from "express";

const sigHeaderName = "X-Signature";
export class AppMiddlewares {

  //  check api key from frontend is valid or not
  public static isApiProtected(req: Request, res: Response, next: NextFunction) {
    Logging.dev("API Routes are Protected")
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
      req.clientSecret = apiKey;
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
    Logging.dev("IRequestHeaders ID Initiated")
    const requestId = Helpers.RequestId();
    req.headers['X-Request-Id'] = requestId;
    res.setHeader('X-Request-Id', requestId);
    res.setHeader('X-Platform', "AIRAPI - ENJOYS");
    next();
  }
  public static async SecureApiRoutesWithValidateSignature(req: Request, res: Response, next: NextFunction) {
    if (!req.get(sigHeaderName)) {
      return res.status(400).json({
        success: false,
        result: {
          code: 400
        },
        message: "Signature is Required",
      });
    }

    //Extract Signature header
    const sig = req.get(sigHeaderName)
    if (sig == null || sig == "") {
      return res.status(400).json({
        success: false,
        result: {
          code: 400
        },
        message: "Signature cant be empty or null",
      });

    }

    // //Calculate HMAC
    const originalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    const [method] = SetAppRoutes.get(req.path)
    const digest = await new Security().GenerateSignature(method, originalUrl, JSON.stringify(req.body), req.clientSecret!) 
    // //Compare HMACs
    if (sig.length !== digest.length || String(sig) !== String(digest)) {
      return res.status(400).json({
        success: false,
        result: {
          code: 400
        },
        message: "Invalid Signature",
      });
    }
    return next();
  }
}