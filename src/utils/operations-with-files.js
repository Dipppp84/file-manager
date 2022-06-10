import path from "path";
import fs from "fs";

function getAbsolutePath(inPath) {
    if (!inPath)
        throw new Error('Operation failed');
    if (inPath.startsWith('.'))
        inPath = inPath.replace('.', process.env.USERPROFILE.toLowerCase())
    else if (!path.isAbsolute(inPath))
        inPath = path.join(global.myOptions.currentlyPath, inPath);
    return inPath;
}

async function copyRecursive(src, dest, remove = false) {
    dest = path.join(dest, path.basename(src));
    if ((await fs.promises.stat(src)).isDirectory()) {
        await fs.promises.mkdir(dest);
        for (const value of (await fs.promises.readdir(src)))
            await copyRecursive(path.join(src, value), dest, remove);
    } else {
        let readStream = fs.createReadStream(src);
        readStream.pipe(fs.createWriteStream(dest));
        if (remove)
            readStream.on('end', () => {
                fs.promises.rm(src).catch(err => {
                    if (err) throw new Error('Operation failed');
                });
            })
    }
}

export async function up() {
    global.myOptions.currentlyPath = path.dirname(global.myOptions.currentlyPath);
}

export async function cd(command) {
    const split = command.split(' ');
    if (split.length !== 2)
        throw new Error('Operation failed');
    const newPath = getAbsolutePath(split[1]);
    if (!fs.existsSync(newPath))
        throw new Error('Operation failed');
    if (!(await fs.promises.stat(newPath)).isDirectory())
        throw new Error('Operation failed');
    global.myOptions.currentlyPath = path.normalize(newPath);
}

export async function ls(command) {
    const split = command.split(' ');
    if (split.length === 1)
        return fs.promises.readdir(global.myOptions.currentlyPath, "utf8");
    if (split.length === 2) {
        const lsPath = getAbsolutePath(split[1]);
        try {
            return await fs.promises.readdir(lsPath, "utf8");
        } catch (e) {
            throw new Error('Operation failed');
        }
    } else throw new Error('Operation failed');
}

export async function cat(command) {
    const split = command.split(' ');
    if (split.length !== 2)
        throw new Error('Operation failed');
    let filePath = getAbsolutePath(split[1]);
    if (!fs.existsSync(filePath))
        throw new Error('Operation failed');
    await new Promise(resolve => {
        let readStream = fs.createReadStream(filePath, "utf8");
        readStream.on('end', () => {
            console.log();
            resolve();
        })
        readStream.pipe(process.stdout);
    })
}

export async function add(command) {
    const split = command.split(' ');
    if (split.length !== 2)
        throw new Error('Operation failed');
    const addPath = getAbsolutePath(command.split(' ')[1]);
    await fs.promises.writeFile(addPath, '', {flag: 'ax'}).catch(err => {
        if (err)
            throw new Error('Operation failed');
    });
}

export async function rn(command) {
    const paths = getTwoPathsOfCommand(command);
    const filePath = getAbsolutePath(paths[0]);
    const newNamePath = getAbsolutePath(paths[1]);
    if (!fs.existsSync(filePath))
        throw new Error('Operation failed');
    await fs.promises.rename(filePath, newNamePath);
}

export async function cp(command) {
    const paths = getTwoPathsOfCommand(command);
    const filePath = getAbsolutePath(paths[0]);
    const newDirPath = getAbsolutePath(paths[1]);
    if (!fs.existsSync(filePath))
        throw new Error('Operation failed');
    if (!fs.existsSync(newDirPath) || (await fs.promises.stat(newDirPath)).isFile())
        throw new Error('Operation failed');
    await copyRecursive(filePath, newDirPath);
}

export async function mv(command) {
    const paths = getTwoPathsOfCommand(command);
    const filePath = getAbsolutePath(paths[0]);
    const newDirPath = getAbsolutePath(paths[1]);
    if (!fs.existsSync(filePath))
        throw new Error('Operation failed');
    if (!fs.existsSync(newDirPath) || (await fs.promises.stat(newDirPath)).isFile())
        throw new Error('Operation failed');
    await copyRecursive(filePath, newDirPath, true);
    if ((await fs.promises.stat(filePath)).isDirectory())
        await fs.promises.rm(filePath, {recursive: true, force: true});
}

export async function rm(command) {
    const split = command.split(' ');
    if (split.length !== 2)
        throw new Error('Operation failed');
    const rmPath = getAbsolutePath(command.split(' ')[1]);
    try {
        await fs.promises.rm(rmPath);
    } catch (err) {
        throw new Error('Operation failed');
    }
}

function getTwoPathsOfCommand(command) {
    const split = command.split(' ');
    if (split.length !== 3)
        throw new Error('Operation failed');
    return split.splice(1);
}