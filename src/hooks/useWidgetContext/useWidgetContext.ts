import { useContext, useState, useEffect, useCallback } from 'react';
import { useAppState } from '../../state';
import useUsers from '../partyHooks/useUsers';
import useCurrentRoom from '../useCurrentRoom/useCurrentRoom';
import { RoomWidgetContext } from '../../components/RoomWidget/RoomWidgetProvider';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const SET_WIDGET_STATE = gql`
  mutation SetWidgetState($roomId: String!, $state: String!) {
    setRoomWidgetState(id: $roomId, state: $state) {
      id
      widgetState
    }
  }
`;

export default function useWidgetContext(initialState?: any) {
  const context = useContext(RoomWidgetContext);
  if (!context) {
    throw new Error('useWidgetContext must be used within a RoomWidgetProvider');
  }

  const [ready, setReady] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [state, setStateCache] = useState<any>(initialState || {});
  const [setWidgetState, { data }] = useMutation(SET_WIDGET_STATE, {
    onCompleted: () => setReady(true),
  });
  const { user } = useAppState();
  const room = useCurrentRoom();
  const { users } = useUsers();
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    if (initialState && room && room.widgetUser === user?.identity && !initialized) {
      setWidgetState({
        variables: { roomId: room.id, state: JSON.stringify(initialState) },
      });
      setInitialized(true);
    }
  }, [initialState, initialized, room, setWidgetState, user]);

  useEffect(() => {
    if (room) {
      setParticipants(users.filter((u: any) => u.room === room.id));
    }
  }, [room, users]);

  useEffect(() => {
    if (data) setStateCache(JSON.parse(data.setRoomWidgetState.widgetState));
  }, [data]);

  const setState = useCallback(
    (newState: any) => {
      setWidgetState({
        variables: { roomId: room.id, state: JSON.stringify(newState) },
      });
    },
    [room, setWidgetState]
  );

  return { state, setState, user, room, participants, ready };
}
