import React, { useCallback } from 'react';
import useCurrentRoom from '../../hooks/useCurrentRoom/useCurrentRoom';
import useApi from '../../hooks/useApi/useApi';
import ParticipantGrid from './ParticipantGrid';
import { styled } from '@material-ui/core/styles';
import WidgetSelector from './WidgetSelector';
import { Button } from '@material-ui/core';
import RoomWidget from '../RoomWidget/RoomWidget';

const Container = styled('div')({
  position: 'relative',
  height: '100%',
});

const RoomControlsContainer = styled('div')({
  position: 'absolute',
  height: '100px',
  left: '50%',
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 100,
  marginLeft: '-300px',
  width: '600px',
});

export default function Room() {
  const room = useCurrentRoom();
  const { callApi } = useApi();

  const removeWidget = useCallback(() => {
    if (room) {
      callApi('delete_widget_state', {
        roomId: room.id,
      })
        .then(() => {})
        .catch(e => console.error(e));
    }
  }, [callApi, room]);

  const onWidgetSelected = useCallback(() => {}, []);

  return (
    <Container>
      <RoomControlsContainer className="room-controls">
        {room?.widgetId ? (
          <Button onClick={removeWidget}>Remove Widget</Button>
        ) : (
          <WidgetSelector room={room} onWidgetSelected={onWidgetSelected} />
        )}
      </RoomControlsContainer>
      <ParticipantGrid>
        {room?.widgetId && <RoomWidget widgetId={room.widgetId} documentId={room.widgetStateId} />}
      </ParticipantGrid>
    </Container>
  );
}
