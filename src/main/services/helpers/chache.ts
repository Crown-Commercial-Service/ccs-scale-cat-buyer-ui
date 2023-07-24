import { createRedisClient } from 'main/setup/redis/client';
import { CacheOptions } from '../types/helpers/cache';

const getCachedData = async <T>(key: string): Promise<T | null> => {
  const client = createRedisClient();

  await client.connect();

  const dataString = await client.get(key);
  const data = dataString ? JSON.parse(dataString) : dataString;

  await client.disconnect();

  return data;
};

const setCachedData = async <T>(data: T, cacheOptions: CacheOptions): Promise<void> => {
  const client = createRedisClient();

  await client.connect();

  await client.set(cacheOptions.key, JSON.stringify(data), {
    EX: cacheOptions.seconds
  });

  await client.disconnect();
};

export { getCachedData, setCachedData };