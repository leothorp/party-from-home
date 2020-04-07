import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Snackbar, IconButton, styled } from '@material-ui/core';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';

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

const BROADCAST_SUBSCRIPTION = gql`
  subscription onBroadcast {
    broadcastSent {
      id
      user {
        identity
        displayName
        photoURL
      }
      message
    }
  }
`;

export default function BroadcastedMessageAlert() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { data } = useSubscription(BROADCAST_SUBSCRIPTION, {
    onSubscriptionData: () => setOpen(true),
  });

  const handleClose = useCallback((_: React.SyntheticEvent | MouseEvent, reason?: string) => {
    setOpen(false);
  }, []);

  return (
    <div>
      <Snackbar
        key={'broadcasted-message'}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={15000}
        onClose={handleClose}
        className={classes.snackbarOverride}
        message={
          <>
            <MessageText>{data?.broadcastSent.message || null}</MessageText>
            <MessageAuthor>{data?.broadcastSent.user.displayName || null}</MessageAuthor>
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
