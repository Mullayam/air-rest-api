import { Request, Response } from 'express';
import { Get } from '@enjoys/modules'
import { TestService } from '../../services/test/test.service.js';
import { XController, InjectService } from '../../app/modules/common/index.js';


@XController()
export class BaseController {
    @InjectService(TestService)
    private test:TestService
    
    @Get("/test")
    public index(req: Request, res: Response) {

 
        return { url: this.test.test() }
    }


}
