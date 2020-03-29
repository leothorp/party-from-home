import React from 'react';
import { UserInfoOverlayType, Overlays } from '../../../Overlay';
import { styled, makeStyles, createStyles, Theme } from '@material-ui/core';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import UserInfoOverlay from './UserInfoOverlays/UserInfoOverlay';
import { USER_INFO_OVERLAY_TYPES } from '../../../constants/registryContants';

const Container = styled('div')({
  height: '7.5%',
});

export interface Props {
  maxHeight?: number;
  maxWidth?: number;
  overlays?: UserInfoOverlayType[];
  participant: LocalParticipant | RemoteParticipant;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    staticUserInfoBlock: {
      width: '25%',
      height: '100%',
      display: 'inline-block',
      verticalAlign: 'top',
    },
    innerStaticUserInfoBlock: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      background: 'rgba(0, 0, 0, 0.7)',
    },
    scrollableInfoBlock: {
      width: '75%',
      height: '100%',
      display: 'inline-block',
      verticalAlign: 'top',
    },
    innerScrollableInfoBlock: {
      width: '100%',
      whiteSpace: 'nowrap',
      overflowX: 'scroll',
      overflowY: 'hidden',
      display: 'flex',
      flexDirection: 'row-reverse',
    },
  })
);

export default function UserInfoOverlayArea({ participant }: Props) {
  const classes = useStyles();

  return (
    <Container>
      <div className={classes.staticUserInfoBlock}>
        <div className={classes.innerStaticUserInfoBlock}>
          <UserInfoOverlay
            overlayId={USER_INFO_OVERLAY_TYPES.USER_AND_CONNECTION_INFO}
            participantId={participant.identity}
          />
        </div>
      </div>
      <div className={classes.scrollableInfoBlock}>
        <div className={classes.innerScrollableInfoBlock}>
          <UserInfoOverlay
            overlayId={USER_INFO_OVERLAY_TYPES.NETWORK_QUALITY_LEVEL}
            participantId={participant.identity}
          />
          <UserInfoOverlay
            overlayId={USER_INFO_OVERLAY_TYPES.VIDEO_AND_AUDIO_INFO}
            participantId={participant.identity}
          />
          <UserInfoOverlay overlayId={USER_INFO_OVERLAY_TYPES.PIN_ICON} participantId={participant.identity} />
        </div>
      </div>
    </Container>
  );
}
