import { Logger } from '@hmcts/nodejs-logging';
import { app } from './app';
import config from 'config';

const logger = Logger.getLogger('server');
const SERVER_PORT: number = config.get('PORT');
const port = parseInt(process.env.PORT, 10) || SERVER_PORT;

if (app.locals.ENV === 'development') {
  app.listen(port, () => {
    logger.info(`Application started: https://localhost:${port}`);
  });
} else {
  const server = app.listen(port, () => {
    logger.info(`Application started: http://localhost:${port}`);
  });

  server.keepAliveTimeout = 60 * 100_000;
  server.headersTimeout = 61 * 100_000;
  server.requestTimeout = 61 * 100_000;

  server.on('connection', (socket) => {
    logger.info('A new connection was made by a client.');
    socket.setTimeout(30 * 100_000);
  });
}
