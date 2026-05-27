import { platform } from "node:os";
import { CONFIG } from "@/app/config";
import { Logging } from "@/logs";

const osPlatform = platform();

const url = CONFIG.APP.APP_URL;
const WINDOWS_PLATFORM = "win32";
const MAC_PLATFORM = "darwin";

let _command: string;
export class Platform {
	static LaunchWindow(): void {
		Logging.dev(`Main Instance ${process.pid} is running`);
		if (osPlatform === WINDOWS_PLATFORM) {
			_command = `start microsoft-edge:${url}`;
		} else if (osPlatform === MAC_PLATFORM) {
			_command = `open -a "Google Chrome" ${url}`;
		} else {
			_command = `google-chrome --no-sandbox ${url}`;
		}
		// exec(command);
	}
}
