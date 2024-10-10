export type Methods = "onAppReady" | "onAppShutDown" | "onAppStart" | "onAppError";
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
