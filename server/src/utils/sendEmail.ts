import SparkPost from 'sparkpost';

const client = new SparkPost(process.env.SPARKPOST_API_KEY);

export const sendEmail = async (recipient: string, url: string) => {
  const response = await client.transmissions.send({
    options: {
      sandbox: true,
    },
    content: {
      from: 'testing@sparkpostbox.com',
      subject: 'Confirm email',
      html: `
        <html>
        <body>
        <p>Please confirm your email</p>
        <a href="${url}">confirm email</a>
        </body>
        </html>`,
    },
    recipients: [{ address: recipient }],
  });
  console.log(response);
};
