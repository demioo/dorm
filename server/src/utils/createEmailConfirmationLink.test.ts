import Redis from 'ioredis';
import superagent from 'superagent';
import { User } from '../entity/User';
import { createEmailConfirmationLink } from './createEmailConfirmationLink';
import { createTypeormConnection } from './createTypeormConnection';

let userId: string;
const redis = new Redis();

beforeAll(async () => {
  await createTypeormConnection();
  const user = await User.create({
    email: 'demi@demi.com',
    password: 'eggegg',
  }).save();
  userId = user.id;
});

describe('createEmailConfirmationLink', () => {
  test('confirms user and clears key in redis', async () => {
    const url = await createEmailConfirmationLink(
      process.env.TEST_HOST as string,
      userId,
      redis
    );

    const response = await superagent(url);
    const text = response.text;
    expect(text).toEqual('ok');

    const user = await User.findOne({ where: { id: userId } });
    expect(user?.confirmed).toBeTruthy();

    const chunks = url.split('/');
    const key = chunks[chunks.length - 1];
    const value = await redis.get(key);
    expect(value).toBeNull();
  });
});
