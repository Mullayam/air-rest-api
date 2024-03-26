//  Write Your All Admin API Routes Here
import { Router } from 'express'
import { Validator } from '@/middlewares/validator.middleware';
import { SessionMiddleware } from '@/middlewares/session.Middleware';

export class AdminRoutes {
    constructor(public router: Router = Router()) {
        this.ProtectedRoutes();
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

}