const unhandledRejectionHandler = (logger: any): void => {
  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    logger.error(reason, 'Unhandled Rejection at Promise', promise);
  });
};

export { unhandledRejectionHandler };
