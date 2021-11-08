import { Request } from 'express';
import { Redis } from 'ioredis';

export type Session = {
  userId?: string;
};

export interface ResolverMap {
  [key: string]: {
    [key: string]: (
      parent: any,
      args: any,
      context: {
        redis: Redis;
        url: string;
        session: Session;
      },
      info: any
    ) => any;
  };
}
