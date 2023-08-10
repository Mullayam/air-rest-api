import { AppServer } from "app/bootstrap";
import { Logging } from "app/logs";

export class Kernel extends AppServer {

    constructor() {
        super(7134);  
        this.LoadInstances()
        this.LoadModules()  
    }
    private LoadModules() {
        Logging.log("Loading App Modules")
      

    }
    private LoadInstances() {
        Logging.log("Preparing Instance To Launch")
       

    }

    InitailizeApplication() {  
        Logging.info("InitailizeApplication")     
        AppServer.RunApplication()
    }

}