import { LIFECYCLE_HOOKS_KEY } from "@/utils/helpers/constants";
import { AppEvents } from "@/utils/services/Events";
import { Methods } from "@/utils/interfaces/application.interface";


export class AppLifecycleManager {
    private modules: any[] = [];
    static isAppLifecycleManager = false;
    static setAppLifecycleManager() {
        return this.isAppLifecycleManager = true;
    }
    static initializeModules() {
        const modules = Reflect.getMetadata(LIFECYCLE_HOOKS_KEY, Reflect) || [];
        this.prototype.modules = modules;
        modules.forEach((Module: any) => {
            const instance = new Module();
            if (instance.onModuleInit) instance.onModuleInit();
        });
        this.ListenMethods()
    }


    static destroyModules() {
        const modules = Reflect.getMetadata(LIFECYCLE_HOOKS_KEY, Reflect) || [];
        modules.forEach((Module: any) => {
            const instance = new Module();
            if (instance.onModuleDestroy) instance.onModuleDestroy();
        });
    }

    // Handle App Error and emit `onAppError`
    static handleAppError(error: Error) {
        const modules = Reflect.getMetadata(LIFECYCLE_HOOKS_KEY, Reflect) || [];
        modules.forEach((Module: any) => {
            const instance = new Module();
            if (instance.onAppError) {
                AppEvents.emit('error', instance, error);
            }
        });
    }

    static ListenMethods() {
        this.prototype.onAppReady()
        this.prototype.onAppShutDown()
        this.prototype.onAppStart()
        this.prototype.onAppError()
    }
    // Helper function to check and execute module methods
    private checkAndExecute(methodName: Methods): void {
        this.modules.forEach(Module => {
            if (Module.prototype[methodName]) {
                Module.prototype[methodName]()
            }
        });
    }

    onAppReady(): void {
        AppEvents.on('ready', () => {
            this.checkAndExecute('onAppReady'); // Check and execute onReady
        });
    }

    onAppShutDown(): void {
        AppEvents.on('shutdown', () => {
            this.checkAndExecute('onAppShutDown'); // Check and execute onShutDown
        });
    }

    onAppStart(): void {
        AppEvents.on('start', () => {
            this.checkAndExecute('onAppStart'); // Check and execute onStart
        });
    }

    onAppError(): void {
        AppEvents.on('error', () => {
            this.checkAndExecute('onAppError'); // Check and execute onError
        });
    }
}
