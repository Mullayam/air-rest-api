
export interface onApplicationStart {
    onAppStart(): Promise<void>|void
}
export interface onApplicationShutdown {
    onAppShutdown(): Promise<void>|void
}