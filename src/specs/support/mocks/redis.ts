import { expect, vi } from 'vitest';
import * as redis from 'redis';
import { createClient } from 'redis';

const mockRedisClient: ReturnType<typeof createClient> = {
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

const creatRedisMockSpys = (vitestUtils: typeof vi, data?: object) => {
  const mockCreateClient = vitestUtils.fn(() => mockRedisClient);

  const createClientSpy = vitestUtils.spyOn(redis, 'createClient').mockImplementation(mockCreateClient);
  const onSpy = vitestUtils.spyOn(mockRedisClient, 'on');
  const connectSpy = vitestUtils.spyOn(mockRedisClient, 'connect');
  const disconnectSpy = vitestUtils.spyOn(mockRedisClient, 'disconnect');
  const getSpy = vitestUtils.spyOn(mockRedisClient, 'get');
  const setSpy = vitestUtils.spyOn(mockRedisClient, 'set');

  if (data) {
    getSpy.mockImplementation(async () => JSON.stringify(data));
  } else {
    getSpy.mockImplementation(async ():Promise<string> => null);
  }

  return [createClientSpy, onSpy, connectSpy, disconnectSpy, getSpy, setSpy];
};

const assertRedisCalls = ([createClientSpy, onSpy, connectSpy, disconnectSpy, getSpy, setSpy]: ReturnType<typeof creatRedisMockSpys>, key: string, data: object, EX: number) => {
  expect(createClientSpy).toHaveBeenCalledTimes(2);
  expect(connectSpy).toHaveBeenCalledTimes(2);
  expect(onSpy).toHaveBeenCalledTimes(4);
  expect(disconnectSpy).to.toHaveBeenCalledTimes(2);
  expect(getSpy).toHaveBeenCalledOnce();
  expect(getSpy).toHaveBeenCalledWith(key);
  expect(setSpy).toHaveBeenCalledOnce();
  expect(setSpy).toHaveBeenCalledWith(key, JSON.stringify(data), { EX: EX });
};

const assertRedisCallsWithCache = ([createClientSpy, onSpy, connectSpy, disconnectSpy, getSpy, setSpy]: ReturnType<typeof creatRedisMockSpys>, key: string) => {
  expect(createClientSpy).toHaveBeenCalledOnce();
  expect(connectSpy).toHaveBeenCalledOnce();
  expect(onSpy).toHaveBeenCalledTimes(2);
  expect(disconnectSpy).toHaveBeenCalledOnce();
  expect(getSpy).toHaveBeenCalledOnce();
  expect(getSpy).toHaveBeenCalledWith(key);
  expect(setSpy).not.toHaveBeenCalled();
};

export { creatRedisMockSpys, assertRedisCalls, assertRedisCallsWithCache };
