import { platform } from 'os';
import { exec } from 'child_process';
import { Logging } from '@/logs';
import { CONFIG } from '@/app/config';
const osPlatform = platform();

const url = CONFIG.APP.APP_URL
const WINDOWS_PLATFORM = 'win32';
const MAC_PLATFORM = 'darwin';

let command;
export class Platform {
  static LaunchWindow(): void {
    Logging.dev(`Main Instance ${process.pid} is running`);
    if (osPlatform === WINDOWS_PLATFORM) {
      command = `start microsoft-edge:${url}`;
    } else if (osPlatform === MAC_PLATFORM) {
      command = `open -a "Google Chrome" ${url}`;
    } else {
      command = `google-chrome --no-sandbox ${url}`;
    }
    // exec(command); 
  }
}