process.on('SIGINT', () => {
    exitManager();
});

export function exitManager() {
    console.log(`Thank you for using File Manager, ${global.myOptions.nameUser}!`);
    process.exit();
}