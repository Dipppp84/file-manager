import crypto from 'crypto'
import fs from 'fs'
import {getAbsolutePath} from "./operations-with-files.js";

export async function calculateHash(command) {
    const split = command.split(' ');
    if (split.length !== 2)
        throw new Error('Invalid input');
    const filePath = getAbsolutePath(split[1]);
    try {
        const dataFile = await fs.promises.readFile(filePath);
        const hash = crypto.createHash('sha256');
        return hash.update(dataFile).digest('hex');
    } catch (e) {
        throw new Error('Operation failed');
    }
}