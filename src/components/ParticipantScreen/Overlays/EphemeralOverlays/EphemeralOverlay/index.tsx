import React from 'react';
import { GameSpaceOverlayDefinition } from '../../../../../Overlay';
import EphemeralOverlayProvider from './EphemeralOverlayProvider';

interface Props {
  overlayDefinition: GameSpaceOverlayDefinition;
  participantId: string;
}

export default function GameSpaceOverlay(props: Props) {
  const OverlayComponent = props.overlayDefinition.component;

  return (
    <EphemeralOverlayProvider participantId={props.participantId}>
      <OverlayComponent />
    </EphemeralOverlayProvider>
  );
}
