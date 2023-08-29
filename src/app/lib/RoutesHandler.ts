import { Router } from 'express' 
export class Routes {
    protected router: Router
    constructor(router: Router) {
        this.router = router        
    }
    /**
     * Creates a new instance of the Routes class or returns the existing
     * instance if it already exists.
     *
     * @param {Router} router - The router object used for routing.
      
     */
    static instance(router: Router) {
        if (!Routes.prototype.router) {
            return new Routes(router)
        }
        return router
    }

}