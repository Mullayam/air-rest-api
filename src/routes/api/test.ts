import AuthController from '@/controllers/user/AuthController';
import { RoutesTypes } from '@/utils/types/routes.interface';

export const Routes: Array<RoutesTypes> = [
    {
        routeName: "test",
        method: "GET",
        path: "/test",
        handler: AuthController.Hello,
        middleware: [],
    }

]