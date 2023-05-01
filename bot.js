const cluster = require('cluster');
const { startBot } = require('./start');
if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function(worker, code, signal) {
        console.log("Bot restarting!")

        cluster.fork();
    });
}

if (cluster.isWorker) {
    startBot();
}