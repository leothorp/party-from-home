import React from 'react';
import useCurrentRoom from '../../hooks/useCurrentRoom/useCurrentRoom';
import ParticipantGrid from './ParticipantGrid';
import { styled } from '@material-ui/core/styles';
import RoomWidget from '../RoomWidget/RoomWidget';

const Container = styled('div')({
  position: 'relative',
  height: '100%',
});

export default function Room() {
  const room = useCurrentRoom();

  return (
    <Container>
      <ParticipantGrid>
        {room?.widgetId && <RoomWidget widgetId={room.widgetId} documentId={room.widgetStateId} />}
      </ParticipantGrid>
    </Container>
  );
}
