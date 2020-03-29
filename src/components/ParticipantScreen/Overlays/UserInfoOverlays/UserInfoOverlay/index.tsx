import React from './node_modules/react';
import userInfoOverlayRegistry from '../../../../../registries/userInfoOverlayRegistry';
import UserInfoOverlayProvider from './UserInfoOverlayProvider';

interface Props {
  overlayId: string;
  participantId: string;
}

export default function UserInfoOverlay(props: Props) {
  const userInfoOverlay = userInfoOverlayRegistry[props.overlayId];
  const OverlayComponent = userInfoOverlay.component;

  return (
    <UserInfoOverlayProvider participantId={props.participantId}>
      <OverlayComponent />
    </UserInfoOverlayProvider>
  );
}
