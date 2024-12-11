export class MiscellaneousHelper {
    public static async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    public static getDomainUrl(request: Request) {
        const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('Host')
        if (!host) return null

        const protocol = host.includes('localhost') ? 'http' : 'https'
        return `${protocol}://${host}`
    }
    public static getDomainPathname(request: Request) {
        const pathname = new URL(request.url).pathname
        if (!pathname) return null
        return pathname
    }
    public static combineHeaders(
        ...headers: Array<ResponseInit['headers'] | null | undefined>
    ) {
        const combined = new Headers()
        for (const header of headers) {
            if (!header) continue
            for (const [key, value] of new Headers(header).entries()) {
                combined.append(key, value)
            }
        }
        return combined
    }
    static singleton<Value>(name: string, value: () => Value): Value {
        const globalStore = global as any

        globalStore.__singletons ??= {}
        globalStore.__singletons[name] ??= value()

        return globalStore.__singletons[name]
    }
}