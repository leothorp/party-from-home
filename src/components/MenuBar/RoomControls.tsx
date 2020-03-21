import React from 'react';
import { IconButton, Tooltip, styled, makeStyles, createStyles } from '@material-ui/core';
import { Mic, MicOff, Videocam, VideocamOff, ScreenShare, StopScreenShare } from '@material-ui/icons';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useLocalAudioToggle from '../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useLocalVideoToggle from '../../hooks/useLocalVideoToggle/useLocalVideoToggle';
import useScreenShareToggle from '../../hooks/useScreenShareToggle/useScreenShareToggle';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import WidgetButton from './WidgetButton';

const useStyles = makeStyles(theme =>
  createStyles({
    endCallButton: {
      fontSize: '20px',
      '& > span': {
        height: '23px',
      },
    },
  })
);

const Container = styled('div')({
  display: 'flex',
  marginLeft: 'auto',
});

export default function RoomControls() {
  const classes = useStyles();
  const roomState = useRoomState();
  const isReconnecting = roomState === 'reconnecting';
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const [isScreenShared, toggleScreenShare] = useScreenShareToggle();
  const screenShareParticipant = useScreenShareParticipant();
  const { room } = useVideoContext();
  const disableScreenShareButton = screenShareParticipant && screenShareParticipant !== room.localParticipant;
  const tooltipMessage = isScreenShared ? 'Stop Sharing Screen' : 'Share Screen';

  return (
    <Container>
      {roomState !== 'disconnected' && (
        <>
          <WidgetButton />
          <IconButton onClick={toggleAudioEnabled} disabled={isReconnecting}>
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </IconButton>
          <IconButton onClick={toggleVideoEnabled} disabled={isReconnecting}>
            {isVideoEnabled ? <Videocam /> : <VideocamOff />}
          </IconButton>
          {navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia && (
            <Tooltip
              title={disableScreenShareButton ? 'Cannot share screen when another user is sharing' : tooltipMessage}
              placement="bottom"
              PopperProps={{ disablePortal: true }}
            >
              <div>
                {/* The div element is needed because a disabled button will not emit hover events and we want to display
                    a tooltip when screen sharing is disabled */}
                <IconButton onClick={toggleScreenShare} disabled={isReconnecting || disableScreenShareButton}>
                  {isScreenShared ? <StopScreenShare /> : <ScreenShare />}
                </IconButton>
              </div>
            </Tooltip>
          )}
          <Tooltip title={'Take a break, go to the bathroom!'} placement="bottom" PopperProps={{ disablePortal: true }}>
            <IconButton onClick={() => room.disconnect()} className={classes.endCallButton}>
              <span role="img" aria-label="bathroom">
                🚽
              </span>
            </IconButton>
          </Tooltip>
        </>
      )}
    </Container>
  );
}
