import { buildTypeDefsAndResolvers, AuthChecker, PubSubEngine } from 'type-graphql';
import TwilioResolver from './resolvers/twilio';
import PartyUserResolver from './resolvers/users';
import PartyRoomResolver from './resolvers/rooms';
import PartyBroadcastResolver, { PartyBroadcastFieldResolver } from './resolvers/broadcasts';
import EphemeralPublicationResolver, { EphemeralPublicationFieldResolver } from './resolvers/ephemeralPublications';
import { RequestContext } from './context';

export const authChecker: AuthChecker<RequestContext> = ({ context, root }, roles) => {
  if (roles.find(r => r === 'SELF')) return context.user !== undefined && context.user.identity === root.identity;
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
      EphemeralPublicationResolver,
      EphemeralPublicationFieldResolver,
    ],
    authChecker,
    pubSub,
  });
}
