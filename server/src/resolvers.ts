import { MutationRegisterArgs, QueryHelloArgs } from './generated/graphql';
import { ResolverMap } from './types/graphql-utils';
import * as bcrypt from 'bcryptjs';
import { User } from './entity/User';

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: QueryHelloArgs) => `Hello ${name || 'there'}`,
  },
  Mutation: {
    register: async (_, { email, password }: MutationRegisterArgs) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email, 
        password: hashedPassword 
      }); 
      
      await user.save();
      return true;
    },
  },
};

