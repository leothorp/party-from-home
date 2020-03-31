import { useCallback } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import useRoomState from '../useRoomState/useRoomState';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const GEN_TOKEN = gql`
  mutation GenerateToken($roomId: String!) {
    generateRoomToken(roomId: $roomId)
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

  const [getToken] = useMutation(GEN_TOKEN, {
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
