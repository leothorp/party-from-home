import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleFullscreenButton from '../ToggleFullScreenButton/ToggleFullScreenButton';
import RoomInfoButtonAndPopOver from './RoomInfoButtonAndPopOver/RoomInfoButtonAndPopOver';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from './Menu/Menu';

import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import { Typography } from '@material-ui/core';
import useCurrentRoom from '../../hooks/useCurrentRoom/useCurrentRoom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      boxShadow: 'none',
    },
    form: {
      display: 'flex',
      alignItems: 'center',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    loadingSpinner: {
      marginLeft: '1em',
    },
    displayName: {
      marginLeft: '2.2em',
      minWidth: '200px',
      fontWeight: 600,
    },
    roomName: {
      fontSize: '32px',
      fontWeight: 600,
      lineHeight: '38px',
      display: 'flex',
      alignItems: 'center',
      color: '#E0E0E0',
    },
  })
);

export default function MenuBar() {
  const classes = useStyles();
  const { user } = useAppState();
  const roomState = useRoomState();
  const usersCurrentRoom = useCurrentRoom();

  const roomName =
    usersCurrentRoom?.name == null ? (
      <CircularProgress color="secondary" size={18} />
    ) : (
      <span className={classes.roomName}>{usersCurrentRoom?.name}</span>
    );

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar>
        <Typography className={classes.displayName} variant="body1">
          {user?.displayName}
        </Typography>
        {roomState !== 'disconnected' ? <h3>{roomName}</h3> : null}
        {usersCurrentRoom && <RoomInfoButtonAndPopOver />}
        <ToggleFullscreenButton />
        <Menu />
      </Toolbar>
    </AppBar>
  );
}
