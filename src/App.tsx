import React, { useState, useEffect, useCallback } from 'react';
import { styled } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import MenuBar from './components/MenuBar/MenuBar';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';
import RoomGrid from './components/RoomGrid/RoomGrid';
import AdminEscalation from './components/AdminPanel/AdminEscalation';
import BroadcastedMessageAlert from './components/shared/BroadcastedMessageAlert/BroadcastedMessageAlert';

import useMap from './hooks/useSync/useMap';
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
  const { classes } = this.props;
  const roomState = useRoomState();
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [snackbarToggle, setSnackbarToggle] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const openEscalate = useCallback(
    (e: any) => {
      if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
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

  const handleSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
    setSnackbarToggle(false);
  };

  const userAdded = useCallback((args: any) => {
    const user = args.item.value;
    setSnackbarToggle(true);
    setSnackbarMessage(user.displayName + ' joined the party!');
  }, []);

  useMap('users', {
    onAdded: userAdded,
  });

  return (
    <Container>
      <AdminEscalation open={escalateOpen} onClose={() => setEscalateOpen(false)} />
      <MenuBar />
      <Main>{roomState === 'disconnected' ? <LocalVideoPreview /> : <Room />}</Main>
      <ReconnectingNotification />
      <RoomGrid />
      <BroadcastedMessageAlert />
      <Snackbar ContentProps={{ classes: { root: classes.root }}} anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={snackbarToggle} message={snackbarMessage} autoHideDuration={5000} onClose={handleSnackbarClose} />
    </Container>
  );
}
