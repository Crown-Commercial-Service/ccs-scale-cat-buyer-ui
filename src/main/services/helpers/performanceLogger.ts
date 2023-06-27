import { Logger } from '@hmcts/nodejs-logging';
import { LoggerInstance, LoggerOptions, PerformanceLoggerInterface } from '../types/helpers/performanceLogger';

class FakePerformanceLogger implements PerformanceLoggerInterface {
  startTimer = (): void => { return undefined; };
  endTimerAndLogResult = (): void => { return undefined; };
}

class PerfomanceLogger implements PerformanceLoggerInterface {
  private startTime: number;
  private logger: LoggerInstance;
  private message: string;
  
  constructor(loggerOptions: LoggerOptions) {
    this.logger = Logger.getLogger(loggerOptions.name);
    this.message = loggerOptions.message;
  }

  startTimer = () => {
    this.startTime = performance.now();
  };

  endTimerAndLogResult = () => {
    this.logger.info(`${this.message} in ${performance.now() - this.startTime}ms`);
  };
}

const getPerformanceLogger = (loggerOptions?: LoggerOptions) => {
  if (loggerOptions) {
    return new PerfomanceLogger(loggerOptions);
  } else {
    return new FakePerformanceLogger();
  }
};

export { getPerformanceLogger };
