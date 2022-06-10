//npm run start -- --username=your_username
import {CommandHandler} from "./commandHandler.js";
//import {exitManager} from "./exitManager.js";

if (process.argv[2].startsWith('--username')) {
    global.myOptions = {
        nameUser: process.argv[2].split('=')[1],
        currentlyPath: process.env.USERPROFILE.toLowerCase()
    };
    console.log(`Welcome to the File Manager, ${global.myOptions.nameUser}!\n`);
    console.log(`You are currently in ${global.myOptions.currentlyPath}`);
} else throw new Error('Error argument');

let commandHandler = new CommandHandler();

process.stdin.pipe(commandHandler);

