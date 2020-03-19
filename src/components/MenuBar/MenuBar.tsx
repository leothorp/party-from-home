import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import ToggleFullscreenButton from '../ToggleFullScreenButton/ToggleFullScreenButton';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from './Menu/Menu';

import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
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
  })
);

export default function MenuBar() {
  const classes = useStyles();
  const { user } = useAppState();
  const roomState = useRoomState();

  const roomName = 'Room Name Here';

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar>
        <Typography className={classes.displayName} variant="body1">
          {user?.displayName}
        </Typography>
        {roomState !== 'disconnected' ? <h3>{roomName}</h3> : null}
        <ToggleFullscreenButton />
        <Menu />
      </Toolbar>
    </AppBar>
  );
}
