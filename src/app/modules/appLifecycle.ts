import { Logging } from "@/logs";
import { AppEvents } from "@/utils/services/Events";
import { Methods } from "@/utils/types/application.interface";


export class AppLifecycle {
    private modules: any[] = [];
    /**
     * Initializes the AppLifecycleModules class.
     *
     * @param {any[]} modules Modules that will be called on app lifecycle events
     * @memberof AppLifecycleModules
     */
    static enableHooks(modules: any[]) {
        AppEvents.emit('ready')
        AppEvents.emit('shutdown')
        AppEvents.emit('start')
        this.prototype.modules = modules;
        this.ListenMethods()
        return
    }
    static ListenMethods() {
        this.prototype.onAppReady()
        this.prototype.onAppShutDown()
        this.prototype.onAppStart()
        this.prototype.onAppError()
    }
    // Helper function to check and execute module methods
    private checkAndExecute(methodName: Methods): void {
        this.modules.forEach(module => {
            if (typeof module[methodName] === 'function') {
                module[methodName](); // Call the method
            } else {
                Logging.dev(`${methodName} method not implemented in module ${module.name}`, "error");
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
