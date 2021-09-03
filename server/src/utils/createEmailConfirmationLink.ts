import { v4 } from 'uuid';
import { Redis } from 'ioredis';

const oneDayInSeconds = 60 * 60 * 24;

export const createEmailConfirmationLink = async (
  url: string,
  userId: string,
  redis: Redis
): Promise<string> => {
  const id = v4();
  await redis.set(id, userId, 'ex', oneDayInSeconds);

  return `${url}/confirm/${id}`;
};
