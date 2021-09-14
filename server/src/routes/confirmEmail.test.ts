import superagent from 'superagent';

test('sends "invalid link" back if bad id is sent', async () => {
  const response = await superagent(
    `${process.env.TEST_HOST}/confirm/12342143`
  );
  const text = response.text;
  expect(text).toEqual('invalid link');
});
