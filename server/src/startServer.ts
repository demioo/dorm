import 'reflect-metadata';
import { importSchema } from 'graphql-import';
import { GraphQLServer } from 'graphql-yoga';
import { join } from 'path';
import { createTypeormConnection } from './utils/createTypeormConnection';
import { Server } from 'http';
import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import { mergeSchemas } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';

export const startServer = async (): Promise<Server> => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(join(__dirname, './modules'));
  folders.forEach(folder => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const typeDefs = importSchema(join(__dirname, `./modules/${folder}/schema.graphql`));
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });

  const schema: GraphQLSchema = mergeSchemas({ schemas });
  
  const server = new GraphQLServer({ schema });
  await createTypeormConnection();
  const app = await server.start({ port: process.env.NODE_ENV === 'test' ? 0 : 4000 });
  console.log('Server is running on localhost:4000');

  return app;
};