import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import useMountEffect from '../useMountEffect/useMountEffect';

const QUERY = gql`
  {
    users {
      identity
      displayName
      photoURL
    }
  }
`;

const NEW_USER = gql`
  subscription onNewUser {
    newUser {
      user {
        identity
        displayName
        photoURL
      }
    }
  }
`;

const DELETED_USER = gql`
  subscription onDeletedUser {
    deletedUser {
      identity
    }
  }
`;

export default function useUsers() {
  const { data, subscribeToMore } = useQuery(QUERY);

  useMountEffect(() => {
    subscribeToMore({
      document: NEW_USER,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData || !prev) return prev;

        const newUser = subscriptionData.data.newUser.user;

        if (prev.users.find((u: any) => u.identity === newUser.identity)) return prev;

        return {
          ...prev,
          users: [...prev.users, newUser],
        };
      },
    });

    subscribeToMore({
      document: DELETED_USER,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData || !prev) return prev;

        const userId = subscriptionData.data.deletedUser.identity;

        return {
          ...prev,
          users: prev.users.filter((u: any) => u.identity === userId),
        };
      },
    });
  });

  return { users: (data?.users || []) as any[] };
}
