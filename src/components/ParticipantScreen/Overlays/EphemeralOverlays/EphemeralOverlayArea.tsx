import React from 'react';
import { EphemeralOverlayDefinition } from '../../../../Overlay';
import { styled } from '@material-ui/core';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import EphemeralOverlay from './EphemeralOverlay';

const Container = styled('div')({
  height: '100%',
  width: '100%',
});

export interface Props {
  maxHeight?: number;
  maxWidth?: number;
  overlays: EphemeralOverlayDefinition[];
  participant: LocalParticipant | RemoteParticipant;
}

export default function EphemeralOverlayArea({ participant, overlays }: Props) {
  return (
    <Container>
      {overlays.map(overlay => (
        <EphemeralOverlay key={overlay.id} overlayDefinition={overlay} participantId={participant.identity} />
      ))}
    </Container>
  );
}
