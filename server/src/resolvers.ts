import { MutationRegisterArgs, QueryHelloArgs } from './generated/graphql';
import { ResolverMap } from './types/graphql-utils';

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: QueryHelloArgs) => `Hello ${name || 'there'}`,
  },
  Mutation: {
    register: (_, { email, password }: MutationRegisterArgs) => {},
  },
};
