import { useEffect } from 'react';
import { useAppState } from '../../state';
import useUser from '../partyHooks/useUser';
import useRoom from '../partyHooks/useRoom';

// Returns the object of the party room the current user is in
export default function useCurrentRoom() {
  const { user } = useAppState();
  const { user: currentUser } = useUser({ userId: user?.identity });
  const { getRoom, room: currentRoom } = useRoom();

  useEffect(() => {
    if (currentUser && currentUser.room) {
      getRoom(currentUser.room);
    }
  }, [currentUser, getRoom]);

  return currentUser?.room && currentRoom;
}
