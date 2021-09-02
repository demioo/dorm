import * as bcrypt from 'bcryptjs';
import * as yup from 'yup';
import { User } from '../../entity/User';
import { MutationRegisterArgs } from '../../generated/graphql';
import { ResolverMap } from '../../types/graphql-utils';
import { formatYupError } from '../../utils/formatYupError';
import { DUPLICATE_EMAIL, EMAIL_NOT_LONG_ENOUGH, INVALID_EMAIL, PASSWORD_NOT_LONG_ENOUGH } from './constants';

const schema = yup.object()
  .shape({
    email: yup.string()
      .min(3, EMAIL_NOT_LONG_ENOUGH)
      .max(255)
      .email(INVALID_EMAIL),
    password: yup.string()
      .min(3, PASSWORD_NOT_LONG_ENOUGH)
      .max(255)
  }); 

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_, args: MutationRegisterArgs) => {

      try {
        await schema.validate(args, { abortEarly: false });  
      } catch (error) {
        return formatYupError(error);
      }
      
      const { email, password } = args;
      
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id']
      });
      if (userAlreadyExists) {
        return [
          {
            path: 'email',
            message: DUPLICATE_EMAIL
          }
        ];
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email, 
        password: hashedPassword 
      }); 
      
      await user.save();
      return null;
    },
  },
};

