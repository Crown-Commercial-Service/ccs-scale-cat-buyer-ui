const uncaughtExceptionHandler = (logger: any): void => {
  process.on('uncaughtException', (error: Error, origin: NodeJS.UncaughtExceptionOrigin) => {
    logger.error(error, 'Unhandled Exception at Origin', origin);
  });
};

export { uncaughtExceptionHandler };
