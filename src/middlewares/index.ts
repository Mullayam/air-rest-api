import { AppMiddlewareFunction, IRequestHeaders, isApiProtected } from './app.middlewares.js';
import { ResponseHandler } from './xresponse.middleware.js'

export const Middlewares = [AppMiddlewareFunction, IRequestHeaders, isApiProtected, ResponseHandler]