import { platform } from 'os';
import { exec } from 'child_process';
const osPlatform = platform();
const url ="http://localhost:7134"
const WINDOWS_PLATFORM = 'win32';
const MAC_PLATFORM = 'darwin';

let command;
export class Platform {

    static LaunchWindow(): void {       
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