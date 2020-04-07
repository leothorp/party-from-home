import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Snackbar, styled } from '@material-ui/core';
import useCurrentRoom from '../../hooks/useCurrentRoom/useCurrentRoom';
import useUser from '../../hooks/partyHooks/useUser';
import widgetRegistry from '../../registries/widgetRegistry';

const useStyles = makeStyles(theme => ({
  snackbarOverride: {
    '& > div': {
      background: theme.palette.background.default,
      boxShadow: 'none',
    },
  },
}));

const MessageText = styled('div')({
  color: '#FFFFFF',
  fontSize: '16px',
});

export default function GameBanner() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [inWidget, setInWidget] = useState<string | null>(null);
  const currentRoom = useCurrentRoom();

  const showBanner = useCallback(
    (user: any) => {
      if (currentRoom && currentRoom.widgetId && !inWidget) {
        const widgetName = widgetRegistry[currentRoom.widgetId].name;
        const userName = user.displayName;
        setOpen(true);
        setInWidget(currentRoom.widgetId);
        setMessage(`🎲 ${userName} started ${widgetName}! 🎲`);
      }

      if (currentRoom && !currentRoom.widgetId && inWidget) {
        const widgetName = widgetRegistry[inWidget].name;
        const userName = user.displayName;
        setOpen(true);
        setInWidget(null);
        setMessage(`🎲 ${userName} stopped ${widgetName}! 🎲`);
      }
    },
    [currentRoom, inWidget]
  );
  const { getUser } = useUser({
    onReceive: showBanner,
  });

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    setOpen(false);
  };

  useEffect(() => {
    if (currentRoom && currentRoom.widgetId && !inWidget) {
      getUser(currentRoom.widgetUser);
    }

    if (currentRoom && !currentRoom.widgetId && inWidget) {
      getUser(currentRoom.widgetUser);
    }
  }, [currentRoom, getUser, inWidget]);

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        className={classes.snackbarOverride}
        message={
          <>
            <MessageText>{message}</MessageText>
          </>
        }
        ClickAwayListenerProps={{ mouseEvent: false }}
      />
    </div>
  );
}
