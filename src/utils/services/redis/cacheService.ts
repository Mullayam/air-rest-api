import { __CONFIG__ } from "@/app/config";
import { Logging } from "@/logs";
import { type RedisClientType, createClient } from "redis";

class CacheService {
	public cache: RedisClientType;
	private static instance: CacheService
	private publisher: RedisClientType
	private subscriber: RedisClientType
	private static subscriberInitialized: boolean = false;
	constructor() {
		Logging.dev("Redis Cache Enabled");
		this.cache = createClient({ url: __CONFIG__.CACHE.CACHE_HOST + ":" + __CONFIG__.CACHE.CACHE_PORT });
		this.publisher = this.cache.duplicate()
		this.subscriber = this.cache.duplicate()
		this.ConnectRedisClient()
		this.connectPubSub()
	}
	/**
	 * Connect to the Redis client.
	 *
	 * @private
	 * @return {void}
	 */
	private async ConnectRedisClient(): Promise<void> {
		await this.cache
			.connect()
			.then(() => Logging.dev("Redis Connected Successfully"))
			.catch((error: any) => Logging.error(`Error : ${error}`));
	}
	private connectPubSub() {
		this.publisher.connect().then(() => Logging.dev(`Redis Publisher Connected Successfully`)).catch((error: any) => Logging.error(`Error : ${error}`));
		this.subscriber.connect().then(() => Logging.dev(`Redis Subscriber Connected Successfully`)).catch((error: any) => Logging.error(`Error : ${error}`));
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
	public static set(key: string, value: string, expiresIn = 0): any {
		let EX = 600;
		if (expiresIn !== 0) {
			EX = expiresIn;
		}
		return CacheService.prototype.cache.set(key, value, { EX });
	}
	/**
	 * Retrieves a value from the cache based on the specified key.
	 *
	 * @param {string} key - The key to retrieve the value for.
	 * @return {any} The value associated with the specified key.
	 */
	public static get(key: string): any {
		return CacheService.prototype.cache.get(key);
	}
	/**
	 * Clears all cache.
	 * @return {void} No return value.
	 */
	public static clearAllCache(): void {
		CacheService.prototype.DeleteCache();
	}

	/**
	 * Clears the cache for a given hash key.
	 *
	 * @param {string} hashKey - The hash key to clear the cache for.
	 */
	clearHash(hashKey: string) {
		this.cache.del(JSON.stringify(hashKey));
	}
	public closeClonnection(): void {
		this.publisher.quit()
		this.subscriber.quit()
		this.cache.quit()
	}
	getPubSub() {
		return {
			publisher: this.publisher,
			subscriber: this.subscriber
		}
	}
	publishToChannel(channel: string, data: any) {
		if (typeof data === "object") {
			data = JSON.stringify(data);
		}
		this.publisher.publish(channel, data);
	}
	subscribeToChannel(channel: string, callback: (message: string, channel: string,) => void) {
		if (CacheService.subscriberInitialized) {
			return;
		}
		CacheService.subscriberInitialized = true;
		return this.subscriber.pSubscribe(channel, callback);
	}
	public static getInstance(): CacheService {
		if (!CacheService.instance) {
			CacheService.instance = new CacheService();
		}
		return CacheService.instance;
	}
}
export const Cache = CacheService.getInstance()
