import Helpers from "../app/utils/Helper.js";
import { Request, Response, NextFunction } from "express";
import { Middleware, ExpressMiddlewareInterface } from '@enjoys/modules';
import { Injectable } from '../app/modules/common/index.js';

@Middleware({ type: 'before' })
@Injectable()
export class IRequestHeaders implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction) {
    const requestId = Helpers.RequestId();
    request.headers['X-Request-Id'] = requestId;
    response.setHeader('X-Request-Id', requestId);
    response.setHeader('X-Platform', "AIRAPI");
    next();
  }
}
@Middleware({ type: 'before' })
@Injectable()
export class AppMiddlewareFunction implements ExpressMiddlewareInterface {
  use(request: any, response: any, next: NextFunction) {
    try {
      if (typeof process.env.APP_SECRET === "undefined" || process.env.APP_SECRET === "") {
        throw new Error(
          "Server cannnot be Started without APP KEY/APP_SECRET means all routes are not accessible"
        );
      }
      response.setHeader('Api-Version', 'v1');
      next();
    } catch (error: any) {
      response.send({
        success: false,
        error: error.message,
        message: "Please Generate App Secret First, " + `http://${request.headers.host}/first`,
      });

    }
  }
}
@Middleware({ type: 'before' })
@Injectable()
export class isApiProtected implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction) {
    try {
      const headers = request.headers;
      const apiKey = headers["api_key"] || undefined;
      if (typeof apiKey === "undefined") {
        return response.status(404).json({
          return: false,
          status_code: 404,
          message: "API_KEY is Required",
        });
      }
      if (apiKey !== process.env.API_KEY) {
        return response.status(401).json({
          return: false,
          status_code: 412,
          message: "Invalid KEY, Check API KEY",
        });
      }
      next();
    } catch (error: any) {
      response.send({
        success: false,
        message: error.message,
      });
      response.end();
    }

  }
}