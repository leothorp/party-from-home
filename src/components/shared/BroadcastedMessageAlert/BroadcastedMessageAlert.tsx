import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Snackbar, IconButton, styled } from '@material-ui/core';
import useListItems from '../../../hooks/useSync/useListItems';

const useStyles = makeStyles(theme => ({
  close: {
    padding: theme.spacing(0.5),
  },
  snackbarOverride: {
    '& > div': {
      background: '#0F7F95',
    },
  },
}));

const MessageText = styled('div')({
  color: '#FFFFFF',
  fontSize: '16px',
});

const MessageAuthor = styled('div')({
  color: '#FFFFFF',
  fontSize: '14px',
});

const IconContainer = styled('div')({
  color: '#FFFFFF',
});

export default function BroadcastedMessageAlert() {
  const classes = useStyles();
  const [lastMessageClosedId, setLastMessageClosedId] = useState(null);
  const broadcastedMessages = useListItems('broadcastedMessages') || [];
  const lastBroadcastedMessage = broadcastedMessages[broadcastedMessages.length - 1] || null;

  const handleClose = (_: React.SyntheticEvent | MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setLastMessageClosedId(lastBroadcastedMessage.id);
  };

  const showBroadcastedMessage = !!lastBroadcastedMessage && lastMessageClosedId !== lastBroadcastedMessage.id;

  return (
    <div>
      <Snackbar
        key={'broadcasted-message'}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={showBroadcastedMessage}
        autoHideDuration={15000}
        onClose={handleClose}
        className={classes.snackbarOverride}
        message={
          <>
            <MessageText>{lastBroadcastedMessage?.message || null}</MessageText>
            <MessageAuthor>{lastBroadcastedMessage?.userName || null}</MessageAuthor>
          </>
        }
        action={
          <IconContainer>
            <IconButton aria-label="close" color="inherit" className={classes.close} onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </IconContainer>
        }
      ></Snackbar>
    </div>
  );
}
