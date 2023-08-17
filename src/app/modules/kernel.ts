import { PaytmConfig, PaytmConfigurationValidator } from '@enjoys/paytm'

export class Kernel {
    public static paytm: PaytmConfig;
    constructor() {
        this.InitiaitePaytmInstance()
    }

    /**
     * Initializes the PayTM environment.
     *
     * This function sets up the PayTM environment by creating a new instance of the PaytmConfig class 
     * with the following configuration parameters:
     *  - PAYTM_ENVIRONMENT: "" // TEST/LIVE
     *  - PAYTM_MERCHANT_KEY: "mkey"
     *  - PAYTM_MERCHANT_ID: "mid"
     *  - PAYTM_MERCHANT_WEBSITE: "DEFAULT"
     *  - CALLBACK_URL: "http://localhost:8080/callback"
     *
     * This function is private and does not take any parameters or return any value.
     */
     InitiaitePaytmInstance() {
        Kernel.paytm = new PaytmConfig(this._PrepareEnvironment())
        return this
    }
/**
 * Prepares the environment for the PaytmConfigurationValidator.
 *
 * @return {PaytmConfigurationValidator} The prepared PaytmConfigurationValidator object.
 */
    private _PrepareEnvironment(): PaytmConfigurationValidator {
        return {
            PAYTM_ENVIRONMENT: "LIVE",
            PAYTM_MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY as string,
            PAYTM_MERCHANT_ID: process.env.PAYTM_MERCHANT_KEY as string,
            PAYTM_MERCHANT_WEBSITE: "DEFAULT",
            CALLBACK_URL: process.env.CALLBACK_URL as string,
        }
    }
}