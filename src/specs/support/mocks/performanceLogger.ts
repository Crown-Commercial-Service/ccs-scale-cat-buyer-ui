import { expect, vi } from 'vitest';
import * as performanceLogger from 'main/services/helpers/performanceLogger';
import { LoggerOptions } from 'main/services/types/helpers/performanceLogger';

const mockPerformanceLogger = {
  startTimer: vi.fn,
  endTimerAndLogResult: vi.fn,
};

const creatPerformanceLoggerMockSpys = (vitestUtils: typeof vi) => {
  const mockGetPerformanceLogger = vitestUtils.fn(() => mockPerformanceLogger);

  const getPerformanceLoggerSpy = vitestUtils.spyOn(performanceLogger, 'getPerformanceLogger').mockImplementation(mockGetPerformanceLogger);
  const startTimerSpy = vitestUtils.spyOn(mockPerformanceLogger, 'startTimer');
  const endTimerAndLogResultSpy = vitestUtils.spyOn(mockPerformanceLogger, 'endTimerAndLogResult');
  
  return [getPerformanceLoggerSpy, startTimerSpy, endTimerAndLogResultSpy];
};

const assertPerformanceLoggerCalls = ([getPerformanceLoggerSpy, startTimerSpy, endTimerAndLogResultSpy]: ReturnType<typeof creatPerformanceLoggerMockSpys>, loggerOptions?: LoggerOptions) => {
  expect(getPerformanceLoggerSpy).toHaveBeenCalledOnce();
  expect(getPerformanceLoggerSpy).toHaveBeenCalledWith(loggerOptions);
  expect(startTimerSpy).toHaveBeenCalledOnce();
  expect(endTimerAndLogResultSpy).toHaveBeenCalledOnce();
};

export { creatPerformanceLoggerMockSpys, assertPerformanceLoggerCalls };
