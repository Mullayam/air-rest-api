import { Interceptor } from "../app/lib/Interceptors.js";
import { IAirInterceptor } from "../app/modules/core/interceptors.js";
export class TestInterceptor implements IAirInterceptor {
    InterceptResponse(): void {
        Interceptor.forRoot({
            test: "Test Response",
            bodye: "Test Body Added"
        })
    }

}