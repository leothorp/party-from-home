import { buildTypeDefsAndResolvers } from 'type-graphql';

export default async function schema() {
  return buildTypeDefsAndResolvers({
    resolvers: [],
  });
}