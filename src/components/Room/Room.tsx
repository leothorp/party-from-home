import React from 'react';
import useCurrentRoom from '../../hooks/useCurrentRoom/useCurrentRoom';
import ParticipantGrid from './ParticipantGrid';
import { styled } from '@material-ui/core/styles';
import { Overlays } from '../../Overlay';
import widgetRegistry from '../../registries/widgetRegistry';
import RoomWidget from '../RoomWidget/RoomWidget';

const Container = styled('div')({
  position: 'relative',
  height: '100%',
  padding: '10px',
});

export default function Room() {
  const room = useCurrentRoom();
  const overlays: Overlays = {
    userInfoOverlays: [],
    ephemeralOverlays: [],
    gameSpaceOverlay: undefined,
    borderOverlays: [],
  };

  if (room?.widgetId) {
    const widget = widgetRegistry[room.widgetId];

    if (widget.overlay) {
      overlays.gameSpaceOverlay = widget.overlay;
    }
  }

  return (
    <Container>
      <ParticipantGrid overlays={overlays}>
        {room?.widgetId && <RoomWidget widgetId={room.widgetId} documentId={room.widgetStateId} />}
      </ParticipantGrid>
    </Container>
  );
}
