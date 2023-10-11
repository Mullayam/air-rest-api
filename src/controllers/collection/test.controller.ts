import Controller from '../../app/modules/core/controller.air.js';
import { GET } from '../../app/modules/core/routes.air.js';
import { XResponse } from '../../app/lib/Response.js';
import { useInterceptor } from '../../app/modules/core/interceptors.js';
import { TestInterceptor } from '../../interceptors/Test.interceptor.js';
import { useMiddleware } from '../../app/modules/core/middleware.js';
import { RouteMiddleware } from '../../middlewares/route.Middlewares.js';
import { ControllerBasedMiddleware } from '../../middlewares/controller.middleware.js';



@Controller('/test',ControllerBasedMiddleware)
export default class TestController {

    @GET('/index')
    @useMiddleware(RouteMiddleware)
    @useInterceptor(TestInterceptor)
    public Register(): void {
        XResponse.JSON({ hello: "world !" })
    }


}
