import express from 'express'
import { Providers } from '../app/modules/provider.js';
import { XResponse } from '../app/lib/Response.js';
import { Adapters } from '../app/modules/adapters.js';

export class UnprotectedRoutes {
    public router: express.Router;
    constructor() {
        this.router = express.Router();
        this.ThirdPartyAuthRoutes()
        this.PaymentRoutes()
        this.UnhandledRoutes()
    }

    private ThirdPartyAuthRoutes(): void {
        /** google routes  */
        this.router.get("/g/auth/redirect", () => XResponse.JSON({ url: Providers.get("google") }))
        this.router.post("/g/auth/callback", (req, res) => {
            XResponse.JSON({ body: req.body })
        })
        /** Your own routes  */
    }
    private PaymentRoutes(): void {
        /** Payment Routes */
        this.router.post("/payment/initiate-transaction", Adapters.paytm.InitializeTransaction)
        this.router.post("/payment/response", (req, res) => {
            XResponse.JSON({ data: req.body })
        })
    }
    /**
     * Handles unhandled routes by returning a JSON response with a "Not Found" error message.
     *  
    
     * @return {type} void
     */
    private UnhandledRoutes(): void {
        this.router.use("*", () => XResponse.Error({ error: "Not Found", code: 404, message: "Unhandled Route" }, "NOT_FOUND"))
    }

}
