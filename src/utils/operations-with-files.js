import path from "path";
import fs from "fs";

export function getAbsolutePath(inPath) {
    if (!inPath)
        throw new Error('Operation failed');
    else if (inPath.startsWith('..'))
        inPath = inPath.replace('..', path.dirname(global.myOptions.currentlyPath))
    else if (inPath.startsWith('.'))
        inPath = inPath.replace('.', process.env.USERPROFILE)
    else if (!path.isAbsolute(inPath))
        inPath = path.join(global.myOptions.currentlyPath, inPath);
    return inPath.normalize().toLowerCase();
}

async function copyRecursive(src, dest, remove = false) {
    dest = path.join(dest, path.basename(src));
    if ((await fs.promises.stat(src)).isDirectory()) {
        await fs.promises.mkdir(dest);
        for (const value of (await fs.promises.readdir(src)))
            await copyRecursive(path.join(src, value), dest, remove);
    } else {
        const readStream = fs.createReadStream(src);
        readStream.pipe(fs.createWriteStream(dest));
        if (remove)
            readStream.on('end', () => {
                fs.promises.rm(src);
            });
    }
}

export async function up() {
    global.myOptions.currentlyPath = path.dirname(global.myOptions.currentlyPath);
}

export async function cd(command) {
    const split = command.split(' ');
    if (split.length !== 2)
        throw new Error('Invalid input');
    const newPath = getAbsolutePath(split[1]);
    if (!fs.existsSync(newPath) || !(await fs.promises.stat(newPath)).isDirectory())
        throw new Error('Operation failed');
    global.myOptions.currentlyPath = path.normalize(newPath);
}

export async function ls(command) {
    const split = command.split(' ');
    let lsPath;
    if (split.length === 1)
        lsPath = global.myOptions.currentlyPath;
    else if (split.length === 2)
        lsPath = getAbsolutePath(split[1]);
    else throw new Error('Invalid input');
    try {
        return await fs.promises.readdir(lsPath, "utf8");
    } catch (err) {
        throw new Error('Operation failed');
    }
}

export async function cat(command) {
    const split = command.split(' ');
    if (split.length !== 2)
        throw new Error('Invalid input');
    let filePath = getAbsolutePath(split[1]);
    if (!fs.existsSync(filePath) || !(await fs.promises.stat(filePath)).isFile())
        throw new Error('Operation failed');
    try {
        await new Promise(resolve => {
            let readStream = fs.createReadStream(filePath, "utf8");
            readStream.on('end', () => {
                console.log();
                resolve();
            });
            readStream.pipe(process.stdout);
        })
    } catch (err) {
        throw new Error('Operation failed');
    }
}

export async function add(command) {
    const split = command.split(' ');
    if (split.length !== 2)
        throw new Error('Invalid input');
    const addPath = getAbsolutePath(command.split(' ')[1]);
    try {
        await fs.promises.writeFile(addPath, '', {flag: 'ax'});
    } catch (err) {
        throw new Error('Operation failed');
    }
}

export async function rn(command) {
    const paths = getTwoPaths(command);
    const filePath = paths[0];
    const newNamePath = paths[1];
    if (!fs.existsSync(filePath))
        throw new Error('Operation failed');
    try {
        await fs.promises.rename(filePath, newNamePath);
    } catch (err) {
        throw new Error('Operation failed');
    }
}

export async function cp(command) {
    const paths = getTwoPaths(command);
    const filePath = paths[0];
    const newDirPath = paths[1];
    if (!fs.existsSync(filePath))
        throw new Error('Operation failed');
    if (!fs.existsSync(newDirPath) || (await fs.promises.stat(newDirPath)).isFile())
        throw new Error('Operation failed');
    try {
        await copyRecursive(filePath, newDirPath);
    } catch (err) {
        throw new Error('Operation failed');
    }
}

export async function mv(command) {
    const paths = getTwoPaths(command);
    const filePath = paths[0];
    const newDirPath = paths[1];
    if (!fs.existsSync(filePath))
        throw new Error('Operation failed');
    if (!fs.existsSync(newDirPath) || (await fs.promises.stat(newDirPath)).isFile())
        throw new Error('Operation failed');
    try {
        await copyRecursive(filePath, newDirPath, true);
        if ((await fs.promises.stat(filePath)).isDirectory())
            await fs.promises.rm(filePath, {recursive: true, force: true});
    } catch (err) {
        throw new Error('Operation failed');
    }
}

export async function rm(command) {
    const split = command.split(' ');
    if (split.length !== 2)
        throw new Error('Invalid input');
    const rmPath = getAbsolutePath(command.split(' ')[1]);
    try {
        await fs.promises.rm(rmPath);
    } catch (err) {
        throw new Error('Operation failed');
    }
}

export function getTwoPaths(command) {
    const split = command.split(' ');
    if (split.length !== 3)
        throw new Error('Invalid input');
    return [getAbsolutePath(split[1]), getAbsolutePath(split[2])];
}