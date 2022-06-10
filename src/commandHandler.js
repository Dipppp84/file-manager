import {Writable} from "stream";
import {exitManager} from "./utils/exitManager.js";
import * as fileOperations from "./utils/operations-with-files.js"

export class CommandHandler extends Writable {
    constructor() {
        super();
    }

    async _write(chunk, encoding, callback) {
        try {
            let answer = await this.handler(chunk.toString().trimEnd());
            if (answer)
                console.log(answer)
        } catch (err) {
            console.log(err.message);
        }
        console.log(`You are currently in ${global.myOptions.currentlyPath}`);
        callback();
    }

    async handler(command) {
        if (command === '.exit') {
            exitManager();
        } else if (command === 'up') {
            await fileOperations.up();
        } else if (command.startsWith('cd')) {
            await fileOperations.cd(command);
        } else if (command.startsWith('ls')) {
            return await fileOperations.ls(command);
        } else if (command.startsWith('cat')) {
            await fileOperations.cat(command);
        } else if (command.startsWith('add')) {
            await fileOperations.add(command);
            return 'add done';
        } else if (command.startsWith('rn')) {
            await fileOperations.rn(command);
            return 'rn done';
        } else if (command.startsWith('cp')) {
            await fileOperations.cp(command);
            return 'cp done';
        } else if (command.startsWith('mv')) {
            await fileOperations.mv(command);
            return 'mv done';
        }else if (command.startsWith('rm')) {
            await fileOperations.rm(command);
            return 'rm done';
        } else
            return 'Invalid input';
    }
}

/*function getAbsolutePath(inPath) {
    if (!inPath)
        throw new Error('Operation failed');
    if (inPath.startsWith('.'))
        inPath = inPath.replace('.', process.env.USERPROFILE.toLowerCase())
    else if (!path.isAbsolute(inPath))
        inPath = path.join(global.myOptions.currentlyPath, inPath);
    return inPath;
}*/

/*
.then(value => value).catch(err => {
    if (err) throw new Error('FS operation failed');
})*/
