import { exec } from "child_process"

const url = "http://localhost:3000"



let command = `google-chrome --no-sandbox ${url}`;
console.log(`executing command: ${command}`);

exec(command);
export default function Kernel() {
    console.log("test")
}