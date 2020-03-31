import { buildTypeDefsAndResolvers, AuthChecker } from 'type-graphql';
import TwilioResolver from './resolvers/twilio';
import PartyUserResolver from './resolvers/users';
import { RequestContext } from './context';

export const authChecker: AuthChecker<RequestContext> = ({ context }, roles) => {
  if (roles.find(r => r === 'USER'))
    return context.identity !== undefined;
  
  return false;
};

export default async function schema() {
  return buildTypeDefsAndResolvers({
    resolvers: [TwilioResolver, PartyUserResolver],
    authChecker,
  });
}
