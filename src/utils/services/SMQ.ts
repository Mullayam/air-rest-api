import { EventEmitter } from "node:events";

/* Simple Queue systyem to use Throughout the app only for testing purposes */
export class SimpleQueue extends EventEmitter {
	private queues = new Map<string, string>();
	private queueName = "queue_";
	constructor(queue_name: string) {
		super();
		this.queueName = this.queueName + queue_name;
	}

	produce(message: any) {
		message = typeof message === "string" ? message : JSON.stringify(message);
		this.queues.set(this.queueName, message);
		this.emit(this.queueName, message);
	}

	consume(callback: (data: any) => void) {
		return new Promise((resolve) => {
			if (this.queues.size > 0) {
				this.queues.delete(this.queueName);
				this.once(this.queueName, (message: string) => {
					resolve(callback(message));
				});
			} else {
				this.once(this.queueName, (message: string) => {
					resolve(callback(message));
				});
			}
		});
	}
}
