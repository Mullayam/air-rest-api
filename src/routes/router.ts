import { Handler, Router } from 'express'
import { controllers } from '../controllers/index.js';
import { BasePath, IRouter } from '../app/modules/core/routes.air.js'
import { MetadataKeys } from '../app/modules/core/controller.air.js';
import { Logging } from '../logs/index.js';
import { getMiddlewares } from '../app/modules/core/middleware.js';
import { ActivateInterceptor } from '../app/modules/core/interceptors.js';


export class RouterHandler {
    constructor(public router: Router = Router()) {
        this.RegisterRoutes();
    }
    private RegisterRoutes() {
        let routesMiddlware: any[];
        const info: Array<{ path: string, controller: string }> = [];
        controllers.forEach((controllerClass) => {
            const controllerInstance: { [handleName: string]: Handler } = new controllerClass() as any;
            const basePath: BasePath = Reflect.getMetadata(MetadataKeys.BASE_PATH, controllerClass);
            const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass);

            const exRouter = this.router

            routers.forEach(({ method, path, handlerName }) => {
                this.router[method](path, controllerInstance[String(handlerName)].bind(controllerInstance));
                info.push({
                    path: `${method.toLocaleUpperCase()} ${basePath.path + path}`,
                    controller: `${controllerClass.name}.${String(handlerName)}`,
                });
                routesMiddlware = [...basePath.middleware, ...getMiddlewares(handlerName)];
                if (ActivateInterceptor(controllerInstance[String(handlerName)]) !== undefined) {
                    ActivateInterceptor(controllerInstance[String(handlerName)])()
                }
            });

            this.router.use(basePath.path, routesMiddlware, exRouter);

        });
        info.forEach(item => {

            Logging.map(`${item.path}`);
        })
    }
}