import Controller from '../../app/modules/core/controller.air.js';
import { GET } from '../../app/modules/core/routes.air.js';
import { XResponse } from '../../app/lib/Response.js';

@Controller('/test')
export default class TestController {

    @GET('/index')
    public Register(): void {
        XResponse.JSON({hello:"world !"})
    }


}
