import React from 'react';
import { GameSpaceOverlayDefinition } from '../../../../../Overlay';
import GameSpaceOverlayProvider from './GameSpaceOverlayProvider';

interface Props {
  overlayDefinition: GameSpaceOverlayDefinition;
  participantId: string;
}

export default function GameSpaceOverlay(props: Props) {
  const OverlayComponent = props.overlayDefinition.component;

  return (
    <GameSpaceOverlayProvider participantId={props.participantId}>
      <OverlayComponent />
    </GameSpaceOverlayProvider>
  );
}
