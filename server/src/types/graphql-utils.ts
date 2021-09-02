export interface ResolverMap {
  [key: string]: {
    [key: string]: (parent: any, args: any, context: Record<string, unknown>, info: any) => any;
  };
}
