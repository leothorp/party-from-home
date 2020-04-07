import React from 'react';
import useCurrentRoom from '../../hooks/useCurrentRoom/useCurrentRoom';
import ParticipantGrid from './ParticipantGrid';
import { styled } from '@material-ui/core/styles';
import { Overlays } from '../../Overlay';
import { USER_INFO_OVERLAY_TYPES } from '../../constants/registryContants';
import widgetRegistry from '../../registries/widgetRegistry';
import userInfoOverlayRegistry from '../../registries/userInfoOverlayRegistry';
import RoomWidget from '../RoomWidget/RoomWidget';

const Container = styled('div')({
  position: 'relative',
  height: '100%',
  padding: '10px',
});

export default function Room() {
  const room = useCurrentRoom();
  const overlays: Overlays = {
    userInfoOverlays: [
      // Always have the user's name overlay first
      userInfoOverlayRegistry[USER_INFO_OVERLAY_TYPES.USER_AND_CONNECTION_INFO],
      userInfoOverlayRegistry[USER_INFO_OVERLAY_TYPES.NETWORK_QUALITY_LEVEL],
      userInfoOverlayRegistry[USER_INFO_OVERLAY_TYPES.VIDEO_AND_AUDIO_INFO],
      userInfoOverlayRegistry[USER_INFO_OVERLAY_TYPES.PIN_ICON],
    ],
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
        {room?.widgetId && <RoomWidget widgetId={room.widgetId} roomId={room.id} />}
      </ParticipantGrid>
    </Container>
  );
}
