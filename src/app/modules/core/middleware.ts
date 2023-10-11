import { NextFunction } from "express";
import { MetadataKeys } from "./controller.air.js";
export interface IAirMiddleware {
    useContext(req: Request, res: Response, next: NextFunction):void
}
export interface IAirMiddlewareError {
    useContext(err:Error,req: Request, res: Response, next: NextFunction):void
}
type Middleware<T extends Function | Object> = T;
const MiddlewareIoc = new Map()
export function decorator(fn: (value: any) => void) {
    return (...args: any[]) => {
        // class decorator     
        if (args.length === 1) {
            fn(args[0]);

        } else if (args.length === 3 && args[2].value) {
            // method decorator
            const descriptor = args[2] as PropertyDescriptor;
            if (descriptor.value) {
                fn(descriptor.value);
            }
        }
    };
}
export function useMiddleware<T extends Function | Object>(...mws: Array<Middleware<T>>): ClassDecorator & MethodDecorator {
    return decorator(target => {

        if (mws) {
            const current = fetchMiddlewares<T>(target);
            Reflect.defineMetadata(MetadataKeys.MIDDLEWARE, [...current, ...mws], target);
            
            MiddlewareIoc.set(target.name,Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target))

        }
    });
}
export function fetchMiddlewares<T extends Function | Object>(target: any): Array<Middleware<T>> {

    return Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target) || [];
}
export function getMiddlewares(target:any):any[]{
   const middlewareClass:Middleware<Function>[] = MiddlewareIoc.get(target)
     if(!middlewareClass) return []
    return middlewareClass?.map((item:any) => {
       return( (new item)["useContext"])
    })
} 