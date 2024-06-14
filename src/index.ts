#!/usr/bin/env node

import app from './app';
import * as http from 'http';
import env from './infra/module/dotenv';

import database from './infra/connector/database';
import redisClient from './infra/connector/redis';
import telegramBot from "./infra/connector/telegram";

Error.stackTraceLimit = Infinity;

(async () => {
    await redisClient.connect();
    await database.initPromise;
    if(!telegramBot) throw new Error('Telegram Bot Initialize Fail');
    else console.log('Telegram Bot Initialized!');

    const port = env.HTTP_PORT;
    app.set('port', port);

    const server = http.createServer(app);

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    process.on('uncaughtException', onUncaughtException);

    function onError(error: any) {
        if (error.syscall !== 'listen') throw error;

        const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    function onListening() {
        const addr = server.address();
        const bind =
            typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        console.log('Listening on ' + bind);
    }

    function onUncaughtException(err: Error): void {
        console.log(err);
        return;
    }
})();
