import { Middleware, ExpressMiddlewareInterface } from '@enjoys/modules';
import { NextFunction } from 'express';
import { XResponse } from '../app/lib/Response.js';
import { Injectable } from '../app/modules/common/index.js';

@Middleware({ type: 'before' })
@Injectable()
export class ResponseHandler implements ExpressMiddlewareInterface {
    use(request: any, response: any, next: NextFunction) {           
        new XResponse(request, response, next);
        next()
    }
}