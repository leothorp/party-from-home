import { buildTypeDefsAndResolvers, AuthChecker, PubSubEngine } from 'type-graphql';
import TwilioResolver from './resolvers/twilio';
import PartyUserResolver from './resolvers/users';
import PartyRoomResolver from './resolvers/rooms';
import PartyBroadcastResolver, { PartyBroadcastFieldResolver } from './resolvers/broadcasts';
import { RequestContext } from './context';

export const authChecker: AuthChecker<RequestContext> = ({ context }, roles) => {
  if (roles.find(r => r === 'USER')) return context.user !== undefined;
  if (roles.find(r => r === 'ADMIN')) return context.user?.admin === true;

  return false;
};

export default async function schema(pubSub?: PubSubEngine) {
  return buildTypeDefsAndResolvers({
    resolvers: [
      TwilioResolver,
      PartyUserResolver,
      PartyRoomResolver,
      PartyBroadcastResolver,
      PartyBroadcastFieldResolver,
    ],
    authChecker,
    pubSub,
  });
}
