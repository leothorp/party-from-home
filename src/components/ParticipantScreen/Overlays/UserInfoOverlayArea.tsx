import React from 'react';
import { UserInfoOverlayDefinition } from '../../../Overlay';
import { styled, makeStyles, createStyles, Theme } from '@material-ui/core';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import UserInfoOverlay from './UserInfoOverlays/UserInfoOverlay';

const Container = styled('div')({
  height: '7.5%',
});

export interface Props {
  maxHeight?: number;
  maxWidth?: number;
  overlays: UserInfoOverlayDefinition[];
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
      float: 'left',
      maxWidth: '100%',
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

export default function UserInfoOverlayArea({ participant, overlays }: Props) {
  const classes = useStyles();
  const [userNameOverlay, ...restOfUserOverlays] = overlays;

  return (
    <Container>
      <div className={classes.staticUserInfoBlock}>
        <div className={classes.innerStaticUserInfoBlock}>
          <UserInfoOverlay overlayDefinition={userNameOverlay} participantId={participant.identity} />
        </div>
      </div>
      <div className={classes.scrollableInfoBlock}>
        <div className={classes.innerScrollableInfoBlock}>
          {restOfUserOverlays.map(overlay => (
            <UserInfoOverlay key={overlay.id} overlayDefinition={overlay} participantId={participant.identity} />
          ))}
        </div>
      </div>
    </Container>
  );
}
