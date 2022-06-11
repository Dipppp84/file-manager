import path from "path";
import fs from "fs";
import zlib from "zlib";
import {getTwoPaths} from "./operations-with-files.js";

export async function compress(command) {
    const pathZip = getTwoPaths(command);
    const sourcePath = pathZip[0];
    const destinationPath = path.join(pathZip[1], path.basename(pathZip[0]) + '.br');
    try {
        const source = fs.createReadStream(sourcePath);
        const destination = fs.createWriteStream(destinationPath);
        const gzip = zlib.createBrotliCompress();
        source.pipe(gzip)
            .pipe(destination);
    } catch (err) {
        throw new Error('Operation failed');
    }
}

export async function decompress(command) {
    const pathZip = getTwoPaths(command);
    const sourcePath = pathZip[0];
    const destinationPath = path.join(pathZip[1], path.basename(pathZip[0]).replace('.br', ''));
    try {
        await new Promise((resolve, reject) => {
            const source = fs.createReadStream(sourcePath);
            const destination = fs.createWriteStream(destinationPath);
            const gzip = zlib.createBrotliDecompress();
            gzip.on('end', () => {
                resolve();
            });
            gzip.on('error', err => {
                if (err) {
                    source.destroy();
                    destination.destroy();
                    fs.promises.rm(destinationPath);
                    reject(err);
                }
            });
            source.pipe(gzip)
                .pipe(destination);
        })
    } catch (err) {
        throw new Error('Operation failed');
    }
}