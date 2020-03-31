import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

const cache = new InMemoryCache();
const httpLink = createHttpLink({
  uri: '/api/graphql',
});

const authLink = setContext(request => {
  const storedUser = JSON.parse(window.sessionStorage.getItem('user') || '{}');

  return {
    params: {
      passcode: storedUser.passcode,
      identity: storedUser.identity,
    },
  };
});

const client = new ApolloClient({
  link: httpLink.concat(authLink),
  cache,
});

export default client;
