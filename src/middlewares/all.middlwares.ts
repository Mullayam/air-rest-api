import { OnAppReady } from '@/utils/types/application.interface';
import { Request, Response, NextFunction, RequestHandler } from 'express';

class AllMiddlewares implements OnAppReady {
  onAppReady(): void {
    console.log("first")
  }
  public customMiddlewareFunction(req: Request, res: Response, next: NextFunction) {
    // Your custom middleware logic goes here
    console.log('Custom Middleware executed');
    next();
  }
  logResponseTime(req: Request, res: Response, next: NextFunction) {
    const startHrTime = process.hrtime();
    res.on("finish", () => {
      const elapsedHrTime = process.hrtime(startHrTime);
      const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
      console.log("%s %s %f in %fms", req.method, req.path, req.statusCode, elapsedTimeInMs.toFixed(4));
    });
    next();
  }
}


export function ApplyMiddleware(middlewareFunction: keyof AllMiddlewares): RequestHandler {
  const instance = new AllMiddlewares()
  return function (req: Request, res: Response, next: NextFunction) {
    return instance[middlewareFunction](req, res, next);
  };
}
