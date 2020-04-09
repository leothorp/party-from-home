import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import useMountEffect from '../useMountEffect/useMountEffect';

const QUERY = gql`
  {
    users {
      identity
      displayName
      photoURL
      room
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
        room
      }
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
      document: UPDATED_USER,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData || !prev) return prev;

        const newUser = subscriptionData.data.updatedUser.user;
        const userIndex = prev.users.findIndex((u: any) => u.identity === newUser.identity);

        if (userIndex >= 0) {
          return {
            users: prev.users.map((u: any, i: number) => (u.identity === newUser.identity ? newUser : u)),
          };
        } else {
          return prev;
        }
      },
    });

    subscribeToMore({
      document: DELETED_USER,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData || !prev) return prev;

        const userId = subscriptionData.data.deletedUser.identity;

        return {
          ...prev,
          users: prev.users.filter((u: any) => u.identity !== userId),
        };
      },
    });
  });

  return { users: (data?.users || []) as any[] };
}
