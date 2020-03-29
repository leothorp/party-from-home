import React from 'react';
import { UserInfoOverlayType, Overlays } from '../../../Overlay';
import { styled, makeStyles, createStyles, Theme } from '@material-ui/core';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import PinIcon from '../PinIcon/PinIcon';
import UserInfoOverlay from './UserInfoOverlays/UserInfoOverlay';
import { USER_INFO_OVERLAY_TYPES } from '../../../constants/registryContants';

const Container = styled('div')({});

interface ParticipantScreenProps {
  participant: LocalParticipant | RemoteParticipant;
  isSelected: boolean;
  maxWidth?: number;
  maxHeight?: number;
  overlays?: Overlays;
}

export interface Props {
  isSelected: boolean;
  maxHeight?: number;
  maxWidth?: number;
  overlays?: UserInfoOverlayType[];
  participant: LocalParticipant | RemoteParticipant;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
);

export default function UserInfoOverlayArea({ isSelected, overlays, participant }: Props) {
  const classes = useStyles();

  return (
    <Container>
      <div className={classes.infoRow}>
        <UserInfoOverlay
          overlayId={USER_INFO_OVERLAY_TYPES.USER_AND_CONNECTION_INFO}
          participantId={participant.identity}
        />
      </div>
      <div>
        <UserInfoOverlay
          overlayId={USER_INFO_OVERLAY_TYPES.VIDEO_AND_AUDIO_INFO}
          participantId={participant.identity}
        />
        {isSelected && <PinIcon />}
      </div>
    </Container>
  );
}
