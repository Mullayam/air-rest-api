import { MetadataKeys } from "./controller.air.js";
import { decorator } from "./middleware.js";

export interface IAirInterceptor {
    InterceptResponse(): void
}
export function useInterceptor<T>(interceptor: T): ClassDecorator & MethodDecorator {
    return decorator((target: any) => {
        Reflect.defineMetadata(MetadataKeys.INTERCEPTOR, interceptor, target)

    })
}
export function ActivateInterceptor(target: any) {
    const interceptor = Reflect.getMetadata(MetadataKeys.INTERCEPTOR, target)
    if (interceptor !== undefined) {
        const interceptorInstance = new interceptor        
        return interceptorInstance["InterceptResponse"]
    }

}