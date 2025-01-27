type StorageType = "Redis" | "Memory" | "Disk";
const IN_MEMORY_STORAGE = new Map();

export class StorageService {
	constructor(private storageType: StorageType = "Disk") {}
	static get(key: string) {
		return IN_MEMORY_STORAGE.get(key);
	}
	static set(key: string, value: string) {
		return IN_MEMORY_STORAGE.set(key, value);
	}
	static remove(key: string) {
		return IN_MEMORY_STORAGE.delete(key);
	}
	static size() {
		return IN_MEMORY_STORAGE.size;
	}
	static destroyAll() {
		return IN_MEMORY_STORAGE.clear();
	}
}
