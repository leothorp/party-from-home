import React from 'react';
import { Pin } from '@primer/octicons-react';
import Tooltip from '@material-ui/core/Tooltip';
import SvgIcon from '@material-ui/core/SvgIcon';
import { styled } from '@material-ui/core';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import useSelectedParticipant from '../../../../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useUserInfoOverlayContext from '../../../../../hooks/overlayHooks/useUserInfoOverlayContext';

const ImageContainer = styled('div')({
  display: 'inline-block',
});

export default function PinIcon() {
  const {
    participant,
  }: { participant?: LocalParticipant | RemoteParticipant | undefined } = useUserInfoOverlayContext();
  const [selectedParticipant] = useSelectedParticipant();
  const isSelected = selectedParticipant?.identity === participant?.identity;

  if (!isSelected) {
    return null;
  }

  return (
    <ImageContainer>
      <Tooltip title="Participant is pinned. Click to un-pin." placement="top">
        <SvgIcon style={{ float: 'right', fontSize: '29px' }}>
          <Pin />
        </SvgIcon>
      </Tooltip>
    </ImageContainer>
  );
}
