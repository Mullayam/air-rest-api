import { __CONFIG__ } from "@/app/config";
import { Logging } from "@/logs";
import Helpers, { SetAppRoutes } from "@/utils/helpers";
import { Security } from "@/utils/helpers/security";
import { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";

const sigHeaderName = "X-Signature";
export class AppMiddlewares {
  /**
   * Attaches a Socket.IO server instance to the request object.
   * 
   * @param {Server} io - The Socket.IO server instance to be attached.
   * @return {Function} Middleware function that adds the io instance to the request object and calls the next middleware.
   */
  static attachIoToRequestHandler(io: Server) {
    return (req: Request, res: Response, next: NextFunction) => {
      req.io = io
      next();
    }
  }

  /**
   * Middleware to protect API routes.
   * This middleware checks if the API request contains the required API key header.
   * If the key is not present or is invalid, it will return a 404 or 401 status code respectively.
   * If the key is valid, it will set the client secret to the API key and call the next middleware.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   */
  public static isApiProtected() {
    Logging.dev(`API Route are Protected`)
    return (req: Request, res: Response, next: NextFunction) => {
      const headers = req.headers;
      const apiKey = headers["api_key"] || undefined;
      if (typeof apiKey === "undefined") {
        res.status(404).json({
          success: false,
          result: {
            code: 404
          },
          message: "API_KEY is Required",
        });
        res.end();
        return
      }
      if (apiKey !== __CONFIG__.APP.API_KEY) {
        res.status(401).json({
          success: false,
          status_code: {
            code: 412
          },
          message: "Invalid KEY, Check API KEY",
        });
        res.end();
        return
      }
      req.clientSecret = apiKey;
      next();

    }
  }
  /**
   * Sets the X-Request-Id and X-Platform headers in the request and response objects.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next function in the middleware chain.
   */
  public static IRequestHeaders() {
    Logging.dev("IRequestHeaders ID Initiated")
    return (req: Request, res: Response, next: NextFunction) => {
      const requestId = Helpers.RequestId();
      req.headers['X-Request-Id'] = requestId;
      res.setHeader('X-Request-Id', requestId);
      res.setHeader('X-Platform', "AIRAPI - ENJOYS");
      next();
    }
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