import { useContext, useState, useEffect } from 'react';
import { useAppState } from '../../state';
import useSyncState from '../useSync/useSyncState';
import useMapItems from '../useSync/useMapItems';
import useCurrentRoom from '../useCurrentRoom/useCurrentRoom';
import { RoomWidgetContext } from '../../components/RoomWidget/RoomWidgetProvider';

export default function useWidgetContext(initialState?: any) {
  const context = useContext(RoomWidgetContext);
  if (!context) {
    throw new Error('useWidgetContext must be used within a RoomWidgetProvider');
  }

  const [state, setState] = useSyncState(context.documentId, {
    onReady: () => {
      setReady(true);
    },
    initialState,
  });
  const { user } = useAppState();
  const room = useCurrentRoom();
  const users = useMapItems('users');
  const [participants, setParticipants] = useState<any[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (room) {
      setParticipants(Object.values(users).filter((u: any) => u.room === room.id));
    }
  }, [room, users]);

  return { state, setState, user, room, participants, ready };
}
