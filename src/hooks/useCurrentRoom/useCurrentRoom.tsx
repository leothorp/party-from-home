import { useEffect, useState } from 'react';
import useMapItems from '../useSync/useMapItems';
import { useAppState } from '../../state';

// Returns the object of the party room the current user is in
export default function useCurrentRoom() {
  const users = useMapItems('users');
  const rooms = useMapItems('rooms');
  const { user } = useAppState();
  const [currentRoom, setCurrentRoom] = useState<any | null>(null);

  useEffect(() => {
    if (user && users && rooms) {
      const userRoomId = users[user.identity]?.room;
      const newCurrentRoom = rooms[userRoomId];
      setCurrentRoom(newCurrentRoom);
    }
  }, [rooms, user, users]);

  return currentRoom;
}
