import React, { useCallback, useEffect, useState } from 'react';
import Video from 'twilio-video';
import {
  Drawer,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  styled,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Mic, MicOff, Videocam, VideocamOff, ScreenShare, StopScreenShare } from '@material-ui/icons';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useLocalAudioToggle from '../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useLocalVideoToggle from '../../hooks/useLocalVideoToggle/useLocalVideoToggle';
import useScreenShareToggle from '../../hooks/useScreenShareToggle/useScreenShareToggle';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../state';
import useCurrentRoom from '../../hooks/useCurrentRoom/useCurrentRoom';
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

const Link = styled('a')({
  color: 'yellow',
});

export interface AudioInput {
  deviceId: string;
  name: string;
}

export interface VideoInput {
  deviceId: string;
  name: string;
}

export default function RoomControls() {
  const classes = useStyles();
  const roomState = useRoomState();
  const [isPartyRulesOpen, setIsPartyRulesOpen] = useState(false);
  const isReconnecting = roomState === 'reconnecting';
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const [isScreenShared, toggleScreenShare] = useScreenShareToggle();
  const screenShareParticipant = useScreenShareParticipant();
  const { room, localTracks, setLocalVideoTrack, setLocalAudioTrack } = useVideoContext();
  const { user } = useAppState();
  const currentRoom = useCurrentRoom();
  const disableScreenShareButton = screenShareParticipant && screenShareParticipant !== room.localParticipant;
  const tooltipMessage = isScreenShared ? 'Stop Sharing Screen' : 'Share Screen';
  const [micList, setMicList] = useState<AudioInput[]>([]);
  const [cameraList, setCameraList] = useState<VideoInput[]>([]);
  const [micAnchorEl, setMicAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [camAnchorEl, setCamAnchorEl] = useState<HTMLButtonElement | null>(null);

  const allowedToShareScreen = !currentRoom?.adminScreenshare || user?.token !== undefined;
  const allowedToStartGame =
    !currentRoom?.disableWidgets &&
    (!currentRoom?.adminStartGames || (!currentRoom?.disableWidgets && user?.token !== undefined));

  const openPartyRules = useCallback(event => {
    setIsPartyRulesOpen(true);
  }, []);

  const handlePartyRulesClose = useCallback(event => {
    setIsPartyRulesOpen(false);
  }, []);

  useEffect(() => {
    const localMicList: AudioInput[] = [];
    const localCameraList: VideoInput[] = [];

    let micCount = 1;
    let cameraCount = 1;
    navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
      mediaDevices.forEach(mediaDevice => {
        switch (mediaDevice.kind) {
          case 'audioinput':
            if (mediaDevice.deviceId === 'default') {
              break;
            }
            localMicList.push({
              deviceId: mediaDevice.deviceId,
              name: mediaDevice.label || `Mic ${micCount++}`,
            });
            break;
          case 'videoinput':
            if (mediaDevice.deviceId === 'default') {
              break;
            }
            localCameraList.push({
              deviceId: mediaDevice.deviceId,
              name: mediaDevice.label || `Camera ${cameraCount++}`,
            });
            break;
        }
      });
      setMicList(localMicList);
      setCameraList(localCameraList);
    });
  }, [setMicList, setCameraList]);

  const handleMicDropdownClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMicAnchorEl(event.currentTarget);
  };
  const handleMicDropdownClose = () => {
    setMicAnchorEl(null);
  };

  const openMicDropdown = Boolean(micAnchorEl);

  const handleMicChange = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const newMicId = event.currentTarget.dataset.id as string;

      if (!newMicId) {
        console.error('no mic id found');
        return;
      }

      if (room.localParticipant) {
        const currentAudioTrack = localTracks.find(track => track.kind === 'audio') as Video.LocalAudioTrack;
        const localTrackPublication = room.localParticipant.unpublishTrack(currentAudioTrack);
        room.localParticipant.emit('trackUnpublished', localTrackPublication);
      }

      setLocalAudioTrack(newMicId).then(track => {
        if (room.localParticipant) room.localParticipant.publishTrack(track);
      });
      handleMicDropdownClose();
    },
    [room, setLocalAudioTrack, localTracks]
  );

  const handleCamDropdownClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCamAnchorEl(event.currentTarget);
  };
  const handleCamDropdownClose = () => {
    setCamAnchorEl(null);
  };

  const openCamDropdown = Boolean(camAnchorEl);

  const handleCameraChange = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const newCameraId = event.currentTarget.dataset.id as string;

      if (!newCameraId) {
        console.error('no camera id found');
        return;
      }

      const currentVideoTrack = localTracks.find(track => track.name === 'camera') as Video.LocalVideoTrack;
      if (room.localParticipant) {
        const localTrackPublication = room.localParticipant.unpublishTrack(currentVideoTrack);
        room.localParticipant.emit('trackUnpublished', localTrackPublication);
      }
      currentVideoTrack.stop();

      setLocalVideoTrack(newCameraId).then(track => {
        if (room.localParticipant) room.localParticipant.publishTrack(track);
      });
      handleCamDropdownClose();
    },
    [room, setLocalVideoTrack, localTracks]
  );

  return (
    <Container>
      {roomState !== 'disconnected' && <WidgetButton disabled={isReconnecting || !allowedToStartGame} />}
      <IconButton onClick={toggleAudioEnabled} disabled={isReconnecting}>
        {isAudioEnabled ? <Mic /> : <MicOff />}
      </IconButton>
      <IconButton onClick={handleMicDropdownClick}>
        <ArrowDropDownIcon />
      </IconButton>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={openMicDropdown}
        onClose={handleMicDropdownClose}
        anchorEl={micAnchorEl}
      >
        <List>
          {micList.map((mic: AudioInput) => (
            <ListItem button key={mic.deviceId} onClick={handleMicChange} data-id={mic.deviceId}>
              <ListItemText primary={mic.name} />
            </ListItem>
          ))}
        </List>
      </Popover>
      <IconButton onClick={toggleVideoEnabled} disabled={isReconnecting}>
        {isVideoEnabled ? <Videocam /> : <VideocamOff />}
      </IconButton>
      <IconButton onClick={handleCamDropdownClick}>
        <ArrowDropDownIcon />
      </IconButton>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={openCamDropdown}
        onClose={handleCamDropdownClose}
        anchorEl={camAnchorEl}
      >
        <List>
          {cameraList.map((camera: VideoInput) => (
            <ListItem button key={camera.deviceId} onClick={handleCameraChange} data-id={camera.deviceId}>
              <ListItemText primary={camera.name} />
            </ListItem>
          ))}
        </List>
      </Popover>
      {roomState !== 'disconnected' && (
        <>
          {navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia && (
            <Tooltip
              title={disableScreenShareButton ? 'Cannot share screen when another user is sharing' : tooltipMessage}
              placement="bottom"
              PopperProps={{ disablePortal: true }}
            >
              <div>
                {/* The div element is needed because a disabled button will not emit hover events and we want to display
                    a tooltip when screen sharing is disabled */}
                <IconButton
                  onClick={toggleScreenShare}
                  disabled={isReconnecting || disableScreenShareButton || !allowedToShareScreen}
                >
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
      <IconButton onClick={openPartyRules} className={classes.endCallButton} disabled={isPartyRulesOpen}>
        <span role="img" aria-label="rules">
          📋
        </span>
      </IconButton>
      <Drawer anchor={'bottom'} open={isPartyRulesOpen} onClose={handlePartyRulesClose}>
        <h2>&nbsp;&nbsp;Party Rules</h2>
        <ul>
          <li>Be nice, inviting, and introduce yourself to people! We’re all in this together.</li>
          <li>
            <Link target="blank" href="https://www.watch2gether.com/rooms/8lkzv3katmr6pvgcej?lang=en">
              Listen to the party music with everyone!
            </Link>
          </li>
          <li>Allow newcomers to join your activity!</li>
          <li>If you feel like rooms are crowded, message Nitsan or Carlos to ask to add a room.</li>
          <li>In order to limit background noise in large rooms, try muting yourself when you’re not speaking.</li>
          <li>
            Don’t close an ongoing activity in a room! If you want to have another activity, go to another room or ask
            admins to add a second room for that activity.
          </li>
          <li>
            This party is not free unfortunately. But if you venmo nitsanshai any amount, I will take a shot. All money
            will go towards the cost of the party, and any extra will be donated to the WHO’s{' '}
            <Link target="blank" href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/donate">
              COVID-19 Solidarity Response Fund
            </Link>
            .
          </li>
        </ul>
      </Drawer>
    </Container>
  );
}
