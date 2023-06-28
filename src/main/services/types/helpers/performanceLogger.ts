type LoggerOptions = {
  name: string
  message: string
}

type LoggerInstance = {
  info: (message: string) => void
}

interface PerformanceLoggerInterface {
  startTimer: () => void
  endTimerAndLogResult: () => void
}

export { LoggerOptions, LoggerInstance, PerformanceLoggerInterface };
