import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const cache = new InMemoryCache();
const httpLink = createHttpLink({
  uri: '/api/graphql',
});

const subscriptionClient = new SubscriptionClient('ws://localhost:8081/api/graphql', { reconnect: true });

const wsLink = new WebSocketLink(subscriptionClient);

const authLink = setContext(request => {
  const storedUser = JSON.parse(window.sessionStorage.getItem('user') || '{}');

  return {
    headers: {
      passcode: storedUser.passcode,
      identity: storedUser.identity,
    },
  };
});

const client = new ApolloClient({
  link: split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink)
  ),
  cache,
});

export default client;
