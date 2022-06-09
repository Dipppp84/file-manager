import {Writable} from "stream";

export class CommandHandler extends Writable {
    constructor() {
        super();
    }

    _write(chunk, encoding, callback) {
        let answer = this.handler(chunk.toString().trimEnd());
        if (answer)
            console.log(answer)
        callback()
    }

    handler(command) {
        if (command === '.exit') {
            console.log(`Thank you for using File Manager, ${nameUser}!`);
            process.exit();
        } else if (command === 'ls') {
            return 'list() = >'
        }
    }
}