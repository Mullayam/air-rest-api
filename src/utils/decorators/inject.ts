export function Inject<T>(Class: new (...args: any[]) => T) {
    return function (target: any, propertyName: string): void {
        let instance: T | null = null;

        Object.defineProperty(target, propertyName, {
            get() {
                // Create a new instance if not already created
                if (!instance) {
                    instance = new Class();
                }
                return instance;
            },
            // Make the property read-only
            configurable: false,
            enumerable: true,
        });
    };
}

