import React, { useState, useEffect, useCallback } from 'react';
import { styled } from '@material-ui/core/styles';

import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import MenuBar from './components/MenuBar/MenuBar';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';
import RoomGrid from './components/RoomGrid/RoomGrid';
import AdminEscalation from './components/AdminPanel/AdminEscalation';
import BroadcastedMessageAlert from './components/shared/BroadcastedMessageAlert/BroadcastedMessageAlert';
import UserEntryBanner from './components/UserEntryBanner/UserEntryBanner';
import GameBanner from './components/GameBanner/GameBanner';

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
  const [escalateOpen, setEscalateOpen] = useState(false);

  const openEscalate = useCallback(
    (e: any) => {
      if (e.code === 'KeyB' && (e.ctrlKey || e.metaKey)) {
        setEscalateOpen(true);
      }
    },
    [setEscalateOpen]
  );

  useEffect(() => {
    document.addEventListener('keypress', openEscalate);

    return () => {
      document.removeEventListener('keypress', openEscalate);
    };
  }, [openEscalate]);

  return (
    <Container>
      <AdminEscalation open={escalateOpen} onClose={() => setEscalateOpen(false)} />
      <MenuBar />
      <Main>{roomState === 'disconnected' ? <LocalVideoPreview /> : <Room />}</Main>
      <ReconnectingNotification />
      <RoomGrid />
      <BroadcastedMessageAlert />
      <UserEntryBanner />
      <GameBanner />
    </Container>
  );
}
