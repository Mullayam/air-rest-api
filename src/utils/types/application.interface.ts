export type Methods = "OnModuleInit" | "OnModuleDestroy" | "onAppReady" | "onAppShutDown" | "onAppStart" | "onAppError";
export interface OnAppReady {
    onAppReady(): void;
}

export interface OnAppShutDown {
    onAppShutDown(): void;
}

export interface OnAppStart {
    onAppStart(): void;
}

export interface OnAppError {
    onAppError(): void;
}

export interface OnModuleInit {
    onModuleInit(): void;
}

export interface OnModuleDestroy {
    onModuleDestroy(): void;
}