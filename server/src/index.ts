import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { join } from 'path';
import { resolvers } from './resolvers';

const typeDefs = importSchema(join(__dirname, 'schema.graphql'));

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'));
