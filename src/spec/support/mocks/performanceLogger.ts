import * as performanceLogger from 'main/services/helpers/performanceLogger';
import Sinon from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { LoggerOptions } from 'main/services/types/helpers/performanceLogger';

chai.use(sinonChai);

const mockPerformanceLogger = {
  startTimer: () => {
    // Mocks the start timer call
  },
  endTimerAndLogResult: () => {
    // Mocks the end timer call
  }
};

const creatPerformanceLoggerMockSpy = (mock: Sinon.SinonSandbox, loggerOptions?: LoggerOptions) => {
  const mockedPerformanceLoggerSpy = mock.spy(mockPerformanceLogger);
  mock.stub(performanceLogger, 'getPerformanceLogger').withArgs(loggerOptions).returns(mockPerformanceLogger);

  return mockedPerformanceLoggerSpy;
};

const assertPerformanceLoggerCalls = (mockedPerformanceLoggerSpy: Sinon.SinonSpiedInstance<typeof mockPerformanceLogger>) => {
  expect(mockedPerformanceLoggerSpy.startTimer).to.have.been.calledOnce;
  expect(mockedPerformanceLoggerSpy.endTimerAndLogResult).to.have.been.calledOnce;
};

export { creatPerformanceLoggerMockSpy, assertPerformanceLoggerCalls };
