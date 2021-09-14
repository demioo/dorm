import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema';
import * as fs from 'fs';
import { GraphQLSchema } from 'graphql';
import { importSchema } from 'graphql-import';
import { GraphQLServer } from 'graphql-yoga';
import { Server } from 'http';
import { join } from 'path';
import 'reflect-metadata';
import { redis } from './redis';
import { confirmEmail } from './routes/confirmEmail';
import { createTypeormConnection } from './utils/createTypeormConnection';

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

  const schema: GraphQLSchema = mergeSchemas({ schemas });

  const server = new GraphQLServer({
    schema,
    context: ({ request }) => ({
      redis,
      url: request.protocol + '://' + request.get('host'),
    }),
  });

  server.express.get('/confirm/:id', confirmEmail);

  await createTypeormConnection();
  const app = await server.start({
    port: process.env.NODE_ENV === 'test' ? 0 : 4000,
  });
  console.log('Server is running on localhost:4000');

  return app;
};
