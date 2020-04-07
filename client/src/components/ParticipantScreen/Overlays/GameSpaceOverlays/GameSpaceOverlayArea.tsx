import React from 'react';
import { GameSpaceOverlayDefinition } from '../../../../Overlay';
import { styled } from '@material-ui/core';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import GameSpaceOverlay from './GameSpaceOverlay';

const Container = styled('div')({
  height: '100%',
  width: '100%',
});

export interface Props {
  maxHeight?: number;
  maxWidth?: number;
  overlay?: GameSpaceOverlayDefinition;
  participant: LocalParticipant | RemoteParticipant;
}

export default function GameSpaceOverlayArea({ participant, overlay }: Props) {
  return (
    <Container>
      {overlay && (
        <GameSpaceOverlay key={overlay.id} overlayDefinition={overlay} participantId={participant.identity} />
      )}
    </Container>
  );
}
