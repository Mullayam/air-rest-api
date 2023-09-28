import { XResponse } from "../../app/lib/Response.js";
import { Injectable } from "../../app/modules/common/index.js";

@Injectable()
export class TestService {
       getName() {
              return { hello: "Mellaya" }
       }
       test() {
              XResponse.JSON({ hello: "Mellaya" })
       }
}
