//npm run start -- --username=your_username
import {CommandHandler} from "./commandHandler.js";

if (process.argv[2].startsWith('--username')) {
    global.nameUser = process.argv[2].split('=')[1];
    console.log(`Welcome to the File Manager, ${nameUser}!`)
} else throw new Error('Error argument')

let commandHandler = new CommandHandler();

process.stdin.pipe(commandHandler);
