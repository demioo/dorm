import 'reflect-metadata';
import { importSchema } from 'graphql-import';
import { GraphQLServer } from 'graphql-yoga';
import { join } from 'path';
import { createTypeormConnection } from './utils/createTypeormConnection';
import { Server } from 'http';
import * as fs from 'fs';
import { mergeSchemas, makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import Redis from 'ioredis';
import { User } from './entity/User';

export const startServer = async (): Promise<Server> => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(join(__dirname, './modules'));
  folders.forEach((folder) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const typeDefs = importSchema(
      join(__dirname, `./modules/${folder}/schema.graphql`)
    );
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });

  const redis = new Redis();

  const schema: GraphQLSchema = mergeSchemas({ schemas });

  const server = new GraphQLServer({
    schema,
    context: ({ request }) => ({
      redis,
      url: request.protocol + '://' + request.get('host'),
    }),
  });

  server.express.get('/confirm/:id', async (req, res) => {
    const { id } = req.params;
    const userId = await redis.get(id);
    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
      await redis.del(id);
      res.send('ok');
    } else {
      res.send('invalid link');
    }
  });

  await createTypeormConnection();
  const app = await server.start({
    port: process.env.NODE_ENV === 'test' ? 0 : 4000,
  });
  console.log('Server is running on localhost:4000');

  return app;
};
