import { useEffect } from 'react';
import { useAppState } from '../../state';
import useRoom from '../partyHooks/useRoom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const GET_USER = gql`
  query User($identity: String!) {
    user(identity: $identity) {
      room
    }
  }
`;

// Returns the object of the party room the current user is in
export default function useCurrentRoom() {
  const { user } = useAppState();
  const { getRoom, room: currentRoom } = useRoom();
  const { data } = useQuery(GET_USER, { variables: { identity: user?.identity } });

  useEffect(() => {
    if (data && data.user.room) {
      getRoom(data.user.room);
    }
  }, [data, getRoom]);

  return data?.user.room && currentRoom;
}
