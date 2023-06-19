import * as redis from 'redis';
import Sinon from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { createClient } from 'redis';

type RedisClient = ReturnType<typeof createClient>

chai.use(sinonChai);

const mockRedisClient: RedisClient = {
  on: (_eventName: string, _cb: () => void) => {
    // Mocks the on function
  },
  connect: async () => {
    // Mocks the connect function
  },
  disconnect: async () => {
    // Mocks the disconnect function
  },
  get: async (_key: string): Promise<string> => {
    // Mocks the get function and returns null

    return null;
  },
  set: async (_key: string, _value: string, _options?: { [key: string]: string }) => {
    // Mocks the set function
  }
} as any;

const mockRedisClientWithData = (data: object): RedisClient => {
  return {
    ...mockRedisClient,
    get: async (key: string): Promise<string> => {
      // Mocks the get function and returns the data

      return JSON.stringify(data);
    }
  } as RedisClient;;
};

const creatRedisMockSpy = (mock: Sinon.SinonSandbox, data?: object) => {
  let mockRedisClientSpy: Sinon.SinonSpiedInstance<typeof mockRedisClient>;

  if (data) {
    const mockedRedisClient = mockRedisClientWithData(data);
    mockRedisClientSpy = mock.spy(mockedRedisClient);
    mock.stub(redis, 'createClient').returns(mockedRedisClient);
  } else {
    mockRedisClientSpy = mock.spy(mockRedisClient);
    mock.stub(redis, 'createClient').returns(mockRedisClient);
  }

  return mockRedisClientSpy;
};

const assertRedisCalls = (mockRedisClientSpy: Sinon.SinonSpiedInstance<typeof mockRedisClient>, key: string, data: object, EX: number) => {
  expect(mockRedisClientSpy.connect).to.have.been.called.callCount(2);
  expect(mockRedisClientSpy.on).to.have.been.called.callCount(4);
  expect(mockRedisClientSpy.get).to.have.been.called.calledOnceWith(key);
  expect(mockRedisClientSpy.set).to.have.been.called.calledOnceWith(key, JSON.stringify(data), { EX: EX });
  expect(mockRedisClientSpy.connect).to.have.been.called.callCount(2);
};

const assertRedisCallsWithCache = (mockRedisClientSpy: Sinon.SinonSpiedInstance<typeof mockRedisClient>, key: string) => {
  expect(mockRedisClientSpy.connect).to.have.been.called.calledOnce;
  expect(mockRedisClientSpy.on).to.have.been.called.callCount(2);
  expect(mockRedisClientSpy.get).to.have.been.called.calledOnceWith(key);
  expect(mockRedisClientSpy.set).not.to.have.been.called;
  expect(mockRedisClientSpy.connect).to.have.been.called.calledOnce;
};

export { creatRedisMockSpy, assertRedisCalls, assertRedisCallsWithCache };
