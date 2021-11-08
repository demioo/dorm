import { request } from 'graphql-request';
import { User } from '../../entity/User';
import { createTypeormConnection } from '../../utils/createTypeormConnection';
import { CONFIRM_EMAIL_ERROR, INVALID_LOGIN } from './errorMessages';

const email = 'hello@hello.com';
const password = 'hellohello';

const registerMutation = (eml: string, pass: string) => `
  mutation {
    register(email: "${eml}", password: "${pass}") {
      path
      message
    }
  }
`;

const loginMutation = async (eml: string, pass: string) => `
  mutation {
    login(email: "${eml}", password: "${pass}") {
      path
      message
    }
  }
`;

beforeAll(async () => {
  await createTypeormConnection();
});

const loginExpectError = async (eml: string, pass: string, errMsg: string) => {
  const response = await request(
    process.env.TEST_HOST as string,
    await loginMutation(eml, pass)
  );

  expect(response).toEqual({
    login: [
      {
        path: 'email',
        message: errMsg,
      },
    ],
  });
};

describe('login', () => {
  test(`returns an 'invalid login' message when a user is not found`, async () => {
    await loginExpectError('d@d.com', 'something', INVALID_LOGIN);
  });

  test(`returns an 'email not confirmed' message when appropriate`, async () => {
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password)
    );

    await loginExpectError(email, password, CONFIRM_EMAIL_ERROR);

    await User.update({ email }, { confirmed: true });

    await loginExpectError(email, 'asdffa', INVALID_LOGIN);
  });

  test(`successfully logs in`, async () => {
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password)
    );

    await User.update({ email }, { confirmed: true });

    const response = await request(
      process.env.TEST_HOST as string,
      await loginMutation(email, password)
    );

    expect(response).toEqual({ login: null });
  });
});
