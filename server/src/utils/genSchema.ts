import { mergeSchemas } from '@graphql-tools/schema';
import * as fs from 'fs';
import { GraphQLSchema } from 'graphql';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { join } from 'path';

export const genSchema = () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(join(__dirname, '../modules'));
  folders.forEach((folder) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { resolvers } = require(`../modules/${folder}/resolvers`);
    const typeDefs = importSchema(
      join(__dirname, `../modules/${folder}/schema.graphql`)
    );
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });

  return mergeSchemas({ schemas });
};
