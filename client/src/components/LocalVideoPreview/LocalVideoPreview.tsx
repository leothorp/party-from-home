import React from 'react';
import { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '../VideoTrack/VideoTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { styled } from '@material-ui/core';

const Container = styled('div')({
  width: '680px',
  height: '100%',
  margin: 'auto',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
});

const CallToAction = styled('p')({
  fontSize: '16px',
  fontWeight: 500,
});

export default function LocalVideoPreview() {
  const { localTracks } = useVideoContext();

  const videoTrack = localTracks.find(track => track.name === 'camera') as LocalVideoTrack;

  return (
    <Container>
      {videoTrack && <VideoTrack track={videoTrack} isLocal />}
      <CallToAction>Welcome! Click to join a party room using the drawer below!</CallToAction>
    </Container>
  );
}
