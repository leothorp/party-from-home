import { useCallback } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import useMountEffect from '../useMountEffect/useMountEffect';

const QUERY = gql`
  query User($identity: String!) {
    user(identity: $identity) {
      identity
      displayName
      photoURL
      room
    }
  }
`;

const UPDATED_USER = gql`
  subscription onUpdatedUser {
    updatedUser {
      user {
        identity
        displayName
        photoURL
        room
      }
    }
  }
`;

export default function useUser(options?: { userId?: string; onReceive?: (data: any) => void }) {
  const [get, { data, subscribeToMore }] = useLazyQuery(QUERY, {
    onCompleted: d => {
      if (options?.onReceive) options.onReceive(d.user);

      subscribeToMore({
        document: UPDATED_USER,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData || !prev) return prev;
          console.log(subscriptionData);

          const newUser = subscriptionData.data.updatedUser.user;

          if (newUser.identity === prev.user.identity) {
            return {
              user: newUser,
            };
          } else {
            return prev;
          }
        },
      });
    },
  });

  const getUser = useCallback(
    (identity: string) => {
      if (data && data?.user.identity === identity && options?.onReceive) options.onReceive(data.user);
      else
        get({
          variables: {
            identity,
          },
        });
    },
    [data, get, options]
  );

  useMountEffect(() => {
    if (options?.userId) {
      getUser(options.userId);
    }
  });

  return { user: data?.user, getUser };
}
