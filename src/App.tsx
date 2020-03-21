import React from 'react';
import { styled } from '@material-ui/core/styles';

import Controls from './components/Controls/Controls';
import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import MenuBar from './components/MenuBar/MenuBar';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';
import RoomGrid from './components/RoomGrid/RoomGrid';

import useRoomState from './hooks/useRoomState/useRoomState';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

const Main = styled('main')({
  height: '100%',
  position: 'relative',
});

export default function App() {
  const roomState = useRoomState();

  return (
    <Container>
      <MenuBar />
      <Main>{roomState === 'disconnected' ? <LocalVideoPreview /> : <Room />}</Main>
      <ReconnectingNotification />
      <RoomGrid />
    </Container>
  );
}
