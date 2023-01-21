#!/usr/bin/env node
const { Logger } = require('@hmcts/nodejs-logging');
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import { app } from './app';
import config from 'config';

const logger = Logger.getLogger('server');
const Server_PORT = config.get('PORT');
const port: any = parseInt(process.env.PORT, 10) || Server_PORT;

if (app.locals.ENV === 'development') {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl');
  const sslOptions = {
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt')),
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
  };
  const server = https.createServer(sslOptions, app);
  server.listen(port, () => {
    logger.info(`Application started: https://localhost:${port}`);
  });
} else {
  const ELB = app.listen(port, () => {
    logger.info(`Application started: http://localhost:${port}`);
  });

  ELB.setTimeout(0);
  ELB.keepAliveTimeout = 60 * 100000;
  ELB.headersTimeout = 61 * 100000;
  // ELB.requestTimeout = 61 * 100000;
  ELB.on('connection', function(socket) {
     console.log("A new connection was made by a client.");
     socket.setTimeout(30 * 100000); 
  });
}
