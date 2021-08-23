
import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { MutationRegisterArgs } from '../../generated/graphql';
import { ResolverMap } from '../../types/graphql-utils';

export const resolvers: ResolverMap = {
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

