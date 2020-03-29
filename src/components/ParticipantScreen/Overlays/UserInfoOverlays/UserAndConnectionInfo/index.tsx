import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import ParticipantConnectionIndicator from './ParticipantConnectionIndicator';
import useUserInfoOverlayContext from '../../../../../hooks/overlayHooks/useUserInfoOverlayContext';
import useMapItems from '../../../../../hooks/useSync/useMapItems';

const useStyles = makeStyles({
  identity: {
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '0.1em 0.3em',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
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
    <>
      <h4 className={classes.identity}>
        {participant && <ParticipantConnectionIndicator participant={participant} />}
        {displayedName}
      </h4>
    </>
  );
}
