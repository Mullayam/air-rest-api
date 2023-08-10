import express, { Request,Response, Router } from 'express'

export class Routes {    
    constructor(protected router: express.Router) {        
        this.router = router;        
    }
    static init(path: string, controllers: any) {       
        // let controller: any;
        // if (Array.isArray(controllers)) {            
        //     controller = controllers.join(",")
        // }
        // if (Object.prototype.toString.call(controllers) == '[object Function]') {            
        //    controller = controllers()        }
 
         this.prototype.router?.get("/test",  (req: Request, res: Response) => {
            res.send("hi")
        })
    }

}