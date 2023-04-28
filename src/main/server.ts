#!/usr/bin/env node

const { Logger } = require('@hmcts/nodejs-logging');
import { app } from './app';
import config from 'config';

const logger = Logger.getLogger('server');
const Server_PORT: number = config.get('PORT');
const port = parseInt(process.env.PORT, 10) || Server_PORT;

if (app.locals.ENV === 'development') {
  app.listen(port, () => {
    logger.info(`Application started: https://localhost:${port}`);
  });
} else {
  const ELB = app.listen(port, () => {
    logger.info(`Application started: http://localhost:${port}`);
  });

  // ELB.setTimeout(0);
  ELB.keepAliveTimeout = 60 * 100000;
  ELB.headersTimeout = 61 * 100000;
  ELB.requestTimeout = 61 * 100000;

  ELB.on('connection', function(socket) {
     console.log("A new connection was made by a client.");
     socket.setTimeout(30 * 100000); 
  });
}
