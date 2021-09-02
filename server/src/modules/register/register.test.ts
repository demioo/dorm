import { request } from 'graphql-request';
import { startServer } from '../../startServer';
import { User } from '../../entity/User';
import { AddressInfo } from 'net';
import { DUPLICATE_EMAIL, EMAIL_NOT_LONG_ENOUGH, INVALID_EMAIL, PASSWORD_NOT_LONG_ENOUGH } from './constants';

let getHost = () => '';

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as AddressInfo;
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = 'egg@egg.com';
const password = 'eggegg';

const mutation = (eml: string, pass: string) => `
  mutation {
    register(email: "${eml}", password: "${pass}") {
      path
      message
    }
  }
`;

test('Register user', async () => {
  const response = await request(getHost(), mutation(email, password));
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

});

test('Does not allow duplicate emails', async () => {
  const response = await request(getHost(), mutation(email, password));
  expect(response.register).toHaveLength(1);
  expect(response.register[0].path).toEqual('email');
  expect(response.register[0]).toEqual({ 
    path: 'email',
    message: DUPLICATE_EMAIL
  });
});

test('Throws errors for invalid emails', async () => {
  const response = await request(getHost(), mutation('b', password));
  expect(response.register).toHaveLength(2);
  expect(response.register[0].path).toEqual('email');
  expect(response).toEqual({ 
    register: [
      {
        path: 'email',
        message: EMAIL_NOT_LONG_ENOUGH
      },
      {
        path: 'email',
        message: INVALID_EMAIL 
      }
    ] 
  });
});

test('Throws errors for invalid passwords', async () => {
  const response = await request(getHost(), mutation(email, 'o'));
  expect(response.register).toHaveLength(1);
  expect(response.register[0].path).toEqual('password');
  expect(response).toEqual({ 
    register: [
      {
        path: 'password',
        message: PASSWORD_NOT_LONG_ENOUGH
      }
    ] 
  });
});

test('Throws errors for bad email and password', async () => {
  const response = await request(getHost(), mutation('o', 'k'));
  expect(response.register).toHaveLength(3);
  expect(response).toEqual({ 
    register: [
      {
        path: 'email',
        message: EMAIL_NOT_LONG_ENOUGH
      },
      {
        path: 'email',
        message: INVALID_EMAIL 
      },
      {
        path: 'password',
        message: PASSWORD_NOT_LONG_ENOUGH
      }
    ] 
  });
});
