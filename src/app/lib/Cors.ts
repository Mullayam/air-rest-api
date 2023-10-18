import cors, { CorsOptions } from 'cors'
export class Cors {

    static useCors() {
        return cors({ ...this.options })
    }
    /**
     * Returns the options for the function.
     *
     * @return {CorsOptions} The options object containing the origin, optionsSuccessStatus, and credentials properties.
     */
    private static options(): CorsOptions {
        return {
            origin: '*',
            optionsSuccessStatus: 200,
            credentials: true
        }
    }
}