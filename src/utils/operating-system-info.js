import os from 'os'

function getEOL() {
    return os.EOL.split('');
}

function getCpus() {
    return os.cpus().map(value => {
        delete value.times;
        return value;
    });
}

function getHomedir() {
    return os.homedir();
}

function getUsername() {
    return os.hostname();
}

function getArch() {
    return os.arch();
}

function getCommandOS(command) {
    const split = command.split(' ');
    if (split.length !== 2)
        throw new Error('Invalid input');
    const commandOS = split[1];
    if (!commandOS.startsWith('--'))
        throw new Error('Invalid input');
    return commandOS.slice(2);
}

export function handlerOS(command) {
    const commandOS = getCommandOS(command);
    if (commandOS === 'EOL')
        return getEOL();
    else if (commandOS === 'cpus')
        return getCpus();
    else if (commandOS === 'homedir')
        return getHomedir();
    else if (commandOS === 'username')
        return getUsername();
    else if (commandOS === 'architecture')
        return getArch();
    else throw new Error('Invalid input');
}

