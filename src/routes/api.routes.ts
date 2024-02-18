//  Write Your All API Routes Here

import { UserAuthController } from '@/controllers';
import { UserReqValidator } from '@/factory/validators/User.request.validator';
import { JwtAuth } from '@/middlewares/auth.Middleware';
import { Validator } from '@/middlewares/validator.middleware';
import broadCastEvents from '@/utils/helpers/broadCastEvents';
import { Exception } from '@enjoys/exception';
import { Router } from 'express'

export class ApiRoutes {
    constructor(public apiRoutes: Router = Router()) {
        this.PublicRoutes();
        this.ProtectedRoutes();
        this.UnhandledRoutes();
    }

    /**
     Creates the Public Routes 
     */
    private PublicRoutes(): void {
        this.apiRoutes.get("/auth/login", UserAuthController.default.SendOTP)
    }
    /**
     * Creates the protected routes.
     *
     * @protected
     * @return {void}
     */
    protected ProtectedRoutes(): void {


    }
    /**
     * A function to handle unhandled routes.
     *
     * @returns {void} This function does not return anything.
     */
    private UnhandledRoutes(): void {
        this.apiRoutes.use("/*", (req, res) => {
            throw new Exception.HttpException({ name: "FORBIDDEN", message: "Access Denied", stack: { info: "Forbidden Resource", path: req.baseUrl } })
        }
        )
    }

}