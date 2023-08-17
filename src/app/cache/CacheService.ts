import { Logging } from "app/logs/index.js";
import redis, { RedisClientType } from "redis";
 

export class CacheService {
    public cache: RedisClientType
    constructor() {
        this.cache = redis.createClient({
            password: 'l9GNnvy8Yo0tJFuoJcW2LZHb6itLqcZl',
            socket: {
                host: 'redis-19063.c212.ap-south-1-1.ec2.cloud.redislabs.com',
                port: 19063
            }
        });
        this.ConnectRedisClient()
    }

    /**
     * Connect to the Redis client.
     *
     * @private
     * @return {void}
     */
    private async ConnectRedisClient(): Promise<void> {
        await this.cache.connect().then(() => Logging.info(`Redis Connected Successfully`)).catch((error: any) => Logging.error(`Error : ${error}`));
    }
    /**
     * Deletes the cache.
     *
     * @return {void} 
     */
    private DeleteCache(): void {
        this.cache.flushAll();
    }
    /**
     * Sets a value in the cache with an optional expiration time.
     *
     * @param {string} key - The key to set in the cache.
     * @param {string} value - The value to set in the cache.
     * @param {number} expiresIn - The expiration time in seconds. Defaults to 0 (no expiration).
     * @return {void}
     */
    public static set(key: string, value: string, expiresIn: number = 0): any {
        let EX = 600
        if (expiresIn !== 0) {
            EX = expiresIn
        }
        return this.prototype.cache.set(key, value, { EX });
    }
    /**
     * Retrieves a value from the cache based on the specified key.
     *
     * @param {string} key - The key to retrieve the value for.
     * @return {any} The value associated with the specified key.
     */
    public static get(key: string): any {
        return this.prototype.cache.get(key);
    }
    /**
     * Clears all cache.
     * @return {void} No return value.
     */
    public static clearAllCache(): void {
        this.prototype.DeleteCache()
    }

    /**
     * Clears the cache for a given hash key.
     *
     * @param {string} hashKey - The hash key to clear the cache for.
     */
    clearHash(hashKey: string) {
        this.cache.del(JSON.stringify(hashKey));
    }
}