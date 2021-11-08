import * as bcrypt from 'bcryptjs';

import { User } from '../../entity/User';
import { MutationLoginArgs } from '../../generated/graphql';
import { ResolverMap } from '../../types/graphql-utils';
import { CONFIRM_EMAIL_ERROR } from './errorMessages';

const errorResponse = [
  {
    path: 'email',
    message: 'invalid login',
  },
];

export const resolvers: ResolverMap = {
  Mutation: {
    // register: async (_, args: MutationRegisterArgs, { redis, url }) => {
    login: async (_, { email, password }: MutationLoginArgs, { session }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return errorResponse;
      }

      if (!user.confirmed) {
        return [
          {
            path: 'email',
            message: CONFIRM_EMAIL_ERROR,
          },
        ];
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return errorResponse;
      }

      // login successful
      session.userId = user.id;

      return null;
    },
  },
};
