import { MetadataKeys } from "./controller.air.js";

 
export enum Methods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  OPTIONS = 'options',
  ALL = 'all',
}

export interface IRouter {
  method: Methods;
  path: string;
  handlerName: string | symbol;
}

const MethodDecoratorFactory = (method: Methods) => {
  return (path: string): MethodDecorator => {
   
    return (target, propertyKey) => {
    
      const controllerClass = target.constructor;
    
      const routers: IRouter[] = Reflect.hasMetadata(MetadataKeys.ROUTERS, controllerClass) ?
        Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass) : [];

      routers.push({
        method,
        path,
        handlerName: propertyKey,
      });
      
      Reflect.defineMetadata(MetadataKeys.ROUTERS, routers, controllerClass);
    }
  }
}

export const GET =  MethodDecoratorFactory(Methods.GET);
export const POST = MethodDecoratorFactory(Methods.POST);
export const PUT = MethodDecoratorFactory(Methods.PUT);
export const DELETE = MethodDecoratorFactory(Methods.DELETE);
export const OPTIONS = MethodDecoratorFactory(Methods.OPTIONS);
export const ALL = MethodDecoratorFactory(Methods.ALL);
export const PATCH = MethodDecoratorFactory(Methods.PATCH);

