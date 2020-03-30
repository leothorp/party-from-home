import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import ParticipantConnectionIndicator from './ParticipantConnectionIndicator';
import useUserInfoOverlayContext from '../../../../../hooks/overlayHooks/useUserInfoOverlayContext';
import useMapItems from '../../../../../hooks/useSync/useMapItems';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    padding: '0.1em 0.3em',
    margin: 0,
    display: 'inline',
  },
  nameContainer: {
    margin: 0,
    display: 'inline',
  },
});

export default function UserAndConnectionInfo() {
  const {
    participant,
  }: { participant: LocalParticipant | RemoteParticipant | undefined } = useUserInfoOverlayContext();
  const classes = useStyles();

  const users = useMapItems('users');
  const displayedName = (participant && users[participant.identity]?.displayName) || participant?.identity;

  return (
    <div className={classes.container}>
      {participant && <ParticipantConnectionIndicator participant={participant} />}
      <Tooltip title={displayedName} placement="top">
        <h4 className={classes.nameContainer}>{displayedName}</h4>
      </Tooltip>
    </div>
  );
}
