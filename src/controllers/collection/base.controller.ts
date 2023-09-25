import { Request, Response } from 'express';
import Controller from '../../app/modules/core/controller.air.js';
import { GET } from '../../app/modules/core/routes.air.js';

@Controller('/base')
export default class BaseController {

    @GET('')
    public index(req: Request, res: Response): void {
        res.json({ hello: "World !" });
    }


}
