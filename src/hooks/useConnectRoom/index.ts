import { useCallback } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import useRoomState from '../useRoomState/useRoomState';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';

const GET_TOKEN = gql`
  query GetToken($roomName: String!) {
    getToken(roomName: $roomName)
  }
`;

export default function useConnectRoom() {
  const { connect, room } = useVideoContext();
  const roomState = useRoomState();
  const onToken = useCallback(
    data => {
      if (roomState !== 'disconnected') room.disconnect();
      connect(data.getToken);
    },
    [connect, room, roomState]
  );

  const [getToken] = useLazyQuery(GET_TOKEN, {
    onCompleted: onToken,
  });

  const connectRoom = useCallback(
    (roomId: string) => {
      getToken({
        variables: { roomId },
      });
    },
    [getToken]
  );

  return connectRoom;
}
