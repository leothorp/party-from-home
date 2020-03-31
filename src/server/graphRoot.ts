import { buildTypeDefsAndResolvers } from 'type-graphql';
import PartyUserResolver from './resolvers/users';

export default async function schema() {
  return buildTypeDefsAndResolvers({
    resolvers: [PartyUserResolver],
  });
}
