import React from 'react';
import { EphemeralOverlayDefinition } from '../../../../../Overlay';
import EphemeralOverlayProvider from './EphemeralOverlayProvider';

interface Props {
  overlayDefinition: EphemeralOverlayDefinition;
  participantId: string;
}

export default function EphemeralOverlay(props: Props) {
  const OverlayComponent = props.overlayDefinition.component;

  return (
    <EphemeralOverlayProvider participantId={props.participantId}>
      <OverlayComponent />
    </EphemeralOverlayProvider>
  );
}
