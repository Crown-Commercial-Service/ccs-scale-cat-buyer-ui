interface LoggerOptions {
  name: string
  message: string
}

interface LoggerInstance {
  info: (message: string) => void
}

interface PerformanceLoggerInterface {
  startTimer: () => void
  endTimerAndLogResult: () => void
}

export { LoggerOptions, LoggerInstance, PerformanceLoggerInterface };
