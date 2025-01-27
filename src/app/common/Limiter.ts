import { Logging } from "@/logs";
import { HttpException } from "@enjoys/exception";
import {
	Application,
	type NextFunction,
	type Request,
	type Response,
} from "express";
import {
	type Options,
	type RateLimitRequestHandler,
	rateLimit,
} from "express-rate-limit";
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

const tokenBucket: any = [];

function ThrottleException(
	message: Record<string, any> = {
		path: "/",
		info: "Request Throttled",
		solution:
			"Try Again after time you settled in the rate limit, or disable it",
	},
): void {
	new HttpException({
		name: "TOO_MANY_REQUESTS",
		message: "Current Rate Limit is Exceeded",
		stack: message,
	});
}
const LIMITER_HANDLER = () => ThrottleException();
export class Limiter {
	private static AllLimiters: string[] = [];
	private RATE_LIMIT = 10;

	/**
	 * Enabled the use of RateLimiter for all Api Calls
	 *
	 * @param {number | "noLimit"} limit - The limit parameter that specifies the maximum number of something or "noLimit" to indicate no limit.
	 * @param {number} timeout - The timeout parameter that specifies the duration in milliseconds.
	 */
	static useLimiter(limit: number | "noLimit", timeout = 0) {
		if (limit === "noLimit") return;
		if (timeout === 0) timeout = 1;
		Logging.dev("Rate Limiting is Enabled");
		Limiter.AllLimiters.push("Default Limiter");
		return rateLimit({
			windowMs: timeout * 60 * 1000, // 15 minutes
			max: limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
			standardHeaders: "draft-7", // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
			legacyHeaders: false, // X-RateLimit-* headers
			handler: LIMITER_HANDLER,
			// store: ... , // Use an external store for more precise rate limiting
		});
	}
	/**
	 * Creates a new RateLimit RequestHandler. Can be use in route handlers
	 *
	 * @param {string} LimiterName - The name of the limiter.
	 * @param {Omit<Partial<Options>, "handler">} LimiterOptions - The options for the limiter.
	 * @return {RateLimitRequestHandler} The newly created RateLimitRequestHandler.
	 */
	static forRoute(
		LimiterName: string,
		LimiterOptions: Omit<Partial<Options>, "handler">,
	): RateLimitRequestHandler {
		Limiter.AllLimiters.push(LimiterName);
		Logging.alert(`Rate Limiting is Enabled, Name ${LimiterName}`);

		return rateLimit({ ...LimiterOptions, handler: LIMITER_HANDLER });
	}
	/**
	 * Retrieves the list of active limiters.
	 *
	 * @return {string[]} The list of active limiters.
	 */
	static getActiveLimiters(): string[] {
		return Limiter.AllLimiters;
	}
	/**
	 * TokenLimiter function that returns a function to handle rate limit based on IP address.
	 *
	 * @param {any} req - The request object.
	 * @param {any} res - The response object.
	 * @param {any} next - The next function.
	 * @return {Promise<void>} The result of the rate limit handler.
	 */
	static useTokenLimiter() {
		const rateLimit = new RateLimiterMemory({
			points: 2,
			duration: 30,
		});
		return (req: Request, res: Response, next: NextFunction) =>
			rateLimit
				.consume(req.ip!, 1)
				.then(() => next())
				.catch((rateLimiterRes) => {
					if (rateLimiterRes instanceof RateLimiterRes) {
						return ThrottleException();
					}
				});
	}
	/**
	 * Refills the token bucket if it is below the rate limit.
	 *
	 * @return {void} No return value.
	 */
	refillTokenBucket() {
		if (tokenBucket.length < this.RATE_LIMIT) {
			tokenBucket.push(Date.now());
		}
	}
	/**
	 * Retrieves information about the token bucket.
	 *
	 * @return {object} Object containing bucket limit, current bucket size, and the bucket itself.
	 */
	bucketInfo() {
		return {
			bucketLimit: this.RATE_LIMIT,
			currentBucketSize: tokenBucket.length,
			bucket: tokenBucket,
		};
	}
	/**
	 * Middleware function to handle token bucket logic.
	 *
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object.
	 * @param {any} next - The next function to call.
	 * @return {void} No return value.
	 */
	tokenBucketMiddleware() {
		return (req: Request, res: Response, next: any) => {
			if (tokenBucket.length > 0) {
				const token = tokenBucket.shift();
				res.set("X-RateLimit-Remaining", tokenBucket.length);
				next();
			} else {
				return res
					.status(429)
					.set("X-RateLimit-Remaining", "0")
					.set("Retry-After", "2")
					.json({
						success: false,
						name: "TOO_MANY_REQUESTS",
						message: "Current Rate Limit is Exceeded",
						stack: {
							path: req.path,
							info: "Request Throttled",
							solution:
								"Try Again after time you settled in the rate limit, or disable it",
						},
					});
			}
		};
	}
}
