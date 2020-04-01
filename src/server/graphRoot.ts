import { buildTypeDefsAndResolvers, AuthChecker, PubSubEngine } from 'type-graphql';
import TwilioResolver from './resolvers/twilio';
import PartyUserResolver from './resolvers/users';
import PartyRoomResolver from './resolvers/rooms';
import { RequestContext } from './context';

export const authChecker: AuthChecker<RequestContext> = ({ context }, roles) => {
  if (roles.find(r => r === 'USER')) return context.identity !== undefined;

  return false;
};

export default async function schema(pubSub?: PubSubEngine) {
  return buildTypeDefsAndResolvers({
    resolvers: [TwilioResolver, PartyUserResolver, PartyRoomResolver],
    authChecker,
    pubSub,
  });
}
