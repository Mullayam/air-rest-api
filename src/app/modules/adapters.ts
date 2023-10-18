import { PaytmConfig, PaytmConfigurationValidator } from '@enjoys/paytm'
import { AppDataSource } from '../config/DataSource.js';
import { Logging } from '../../logs/index.js';

export class Adapters {
    public static paytm: PaytmConfig;
    public static TypeORM = AppDataSource   
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
        Adapters.paytm = new PaytmConfig(this._PrepareEnvironment())
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
     /**
     * Initializes the TypeORM Datasource.
     * Establish Database Connection
     * 
     * @private
     * @async
     * @return {Promise<void>} Promise that resolves once the datasource is initialized.
     */
     private async TypeORM_Datasource(): Promise<void> {
        Adapters.TypeORM.initialize()
            .then(() => {
                Logging.alert("Database Connected Successfuly")
                // this.app.emit("ready", "Intiating Application Server")
            })
            .catch((error) => {
                if (error.code === "ECONNREFUSED") {
                    Logging.error("Your Database (MySQL) Server is not Enabled")
                    // this.app.emit("error", "Database Connection Refused, Server Cannot be Started Untill DB connection is Established")
                    return
                }
                console.log(error)
            })
    }
}