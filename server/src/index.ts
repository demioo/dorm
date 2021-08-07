import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { join } from 'path';
import { resolvers } from './resolvers';
import { createConnection } from 'typeorm';

const typeDefs = importSchema(join(__dirname, 'schema.graphql'));

const server = new GraphQLServer({ typeDefs, resolvers });
createConnection().then(() => {
  server.start(() => console.log('Server is running on localhost:4000'));
});
