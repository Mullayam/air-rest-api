import Helpers from "app/utils/Helper";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload,Secret } from "jsonwebtoken";
 

export const SECRET_KEY: Secret = `${process.env.JWT_SECRET_TOKEN}`
export interface CustomRequest extends Request {
  token: string | JwtPayload;  
 }
export class Middlewares {
  //  Check App Variable is Generated or not
  public static MiddlewareFunction(req: Request, res: Response, next: NextFunction): void {     
    
    try {
      if (typeof  process.env.APP_SECRET === "undefined" ||  process.env.APP_SECRET === "") {        
        throw new Error(
          "Server cannnot be Started without APP KEY/APP_SECRET means all routes are not accessible"
        );
      }
      res.setHeader('Api-Version', 'v1');
      next();
    } catch (error:any) {
      res.send({
        success: false,
        error: error.message,
        message: "Please Generate App Secret First, " + `http://${req.headers.host}/first`,
      });
     
    }    
  }
// check user account is active or not
  public static async isAccountActivated(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // get token from headers
      const loggedUserInfo = req.get("loggedUserInfo");
      if (typeof loggedUserInfo === "undefined") {
        throw new Error("User Info is manipulated or not available");
      }
      // const User = await UserModel.findOne({ _id: loggedUserInfo.userId });

      // if (!User) {
      //   throw new Error("User Doest not exist");
      // }
      // if (!User.status === "0x0000") {
      //   throw new Error(
      //     `This Account is not Activated, Please Contact the administrator`
      //   );
      // }
      // if (loggedUserInfo.userRole !== User.role) {
      //   throw new Error("User is not allowed to perform this action");
      // }

      next();
    } catch (error: any) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
  // check user is authenticated or not
  public static isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    console.log("AUTHENTICATION MIDDLEWARE")
    try {
      // get token from headers
      const AuthToken = req.get("Authorization");

      if (typeof AuthToken === "undefined") {
        throw new Error("Invalid Auth Token");
      }
      const token = AuthToken.split(" ")[1];
      if (SECRET_KEY === "undefined" ||SECRET_KEY ==="") {
        throw new Error("JWT SECRET TOKEN is required");
      }
      const DecryptToken = jwt.verify(token,SECRET_KEY);
      (req as CustomRequest).body.user  = DecryptToken;
      console.log(DecryptToken)
      // req.body.user = {
      //   userId: DecryptToken.id,
      //   userEmail: DecryptToken.email,
      //   userRole: DecryptToken.role,
      //   userStatus: DecryptToken.status,
      // };

      next();
    } catch (error: any) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
//  check api key from frontend is valid or not
  public static isApiProtected(req: Request, res: Response, next: NextFunction) {
    try {      
      console.log("Checking API KEY")
      const headers = req.headers;
      const apiKey = headers["api_key"] || undefined;      
      if (typeof apiKey === "undefined") {
      return  res.status(404).json({
          return: false,
          status_code: 404,
          message: "API_KEY is Required",
        });
      }
      if (apiKey !== process.env.API_KEY) {
        return  res.status(401).json({
          return: false,
          status_code: 412,
          message: "Invalid KEY, Check API KEY",
        });
      }
      next();
    } catch (error: any) {
      res.send({
        success: false,
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
        res.setHeader('X-Platform', "Jobcy");
        next();
  }
}