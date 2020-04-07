import React from 'react';
import { UserInfoOverlayDefinition } from '../../../../../Overlay';
import UserInfoOverlayProvider from './UserInfoOverlayProvider';

interface Props {
  overlayDefinition: UserInfoOverlayDefinition;
  participantId: string;
}

export default function UserInfoOverlay(props: Props) {
  const OverlayComponent = props.overlayDefinition.component;

  return (
    <UserInfoOverlayProvider participantId={props.participantId}>
      <OverlayComponent />
    </UserInfoOverlayProvider>
  );
}
