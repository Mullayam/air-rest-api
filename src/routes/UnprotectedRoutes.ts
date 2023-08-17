import express from 'express'
 
export class UnprotectedRoutes {
    public router: express.Router;
    constructor() {
        this.router = express.Router();
        this.ThirdPartyAuthRoutes()
        this.PaymentRoutes()

    }

    private ThirdPartyAuthRoutes(): void {
        /** google routes  */
        // this.router.get("/g/auth/redirect", (req, res) => res.send({ url: Providers.get("google") }))
        // this.router.get("/g/auth/callback", Authentication.default.HandleGoogleAuthCallback)
        /** Your own routes  */
    }
    private PaymentRoutes(): void {
        /** Payment Routes */
        // this.router.post("/payment/initiate-transaction", Kernel.paytm.InitializeTransaction)
        // this.router.post("/payment/response", (req, res) => {
            // res.send({ data: req.body })
        // })
    }
    /**
     * Handles unhandled routes by returning a JSON response with a "Not Found" error message.
     *  
    
     * @return {type} void
     */
    private UnhandledRoutes(): void {
        // this.router.use("*", (req, res) => JSONResponse.Response(req, res, "API is Running", { error: "Not Found", code: 404, message: "Unhandled Route" }))
    }

}
