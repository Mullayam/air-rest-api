import { Action, Interceptor, InterceptorInterface } from "@enjoys/modules";


export class NameCorrectionInterceptor implements InterceptorInterface {
    intercept(action: Action, content: any) {
        return content.replace(/Mulayam/gi, 'Michael');
    }
}