//npm run start -- --username=your_username
import {CommandHandler} from "./command-handler.js";

if (process.argv[2].startsWith('--username')) {
    global.myOptions = {
        nameUser: process.argv[2].split('=')[1],
        currentlyPath: process.env.USERPROFILE.toLowerCase()
    };
    console.log(`Welcome to the File Manager, ${global.myOptions.nameUser}!\n`);
    console.log(`You are currently in ${global.myOptions.currentlyPath}`);
} else throw new Error('Error argument');

const commandHandler = new CommandHandler();
process.stdin.pipe(commandHandler);

