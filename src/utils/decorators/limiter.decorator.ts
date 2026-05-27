import { HttpException } from "@enjoys/exception";
import { type Options, rateLimit } from "express-rate-limit";
function ThrottleException(
	message: Record<string, any> = {
		path: "/",
		info: "Request Throttled",
		solution: "Try Again after time",
	},
): void {
	new HttpException({
		name: "TOO_MANY_REQUESTS",
		message: "Current Rate Limit is Exceeded",
		stack: message,
	});
}
// Interface for rate limit options
type RateLimitOptions = Omit<Partial<Options>, "handler">;
export function UseLimiter(limit?: number | "noLimit", timeout = 0): Function {
	return (target: any, key: any, descriptor: PropertyDescriptor) => {
		if (limit === "noLimit") return descriptor;
		if (timeout === 0) timeout = 1;
		const originalMethod = descriptor.value;
		const limiterMiddleware = rateLimit({
			windowMs: timeout * 60 * 1000,
			max: limit || 60,
			standardHeaders: "draft-7",
			legacyHeaders: false,
			handler: ThrottleException,
		});

		descriptor.value = function (req: any, res: any, next: any) {
			limiterMiddleware(req, res, () => {
				originalMethod.call(this, req, res, next);
			});
		};
		return descriptor;
	};
}
