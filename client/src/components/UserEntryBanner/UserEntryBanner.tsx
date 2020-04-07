import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Snackbar, styled } from '@material-ui/core';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';

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

const NEW_USER = gql`
  subscription onNewUser {
    newUser {
      user {
        identity
        displayName
        photoURL
      }
    }
  }
`;

const REMOVED_USER = gql`
  subscription onDeletedUser {
    deletedUser {
      identity

      user {
        displayName
        photoURL
      }
    }
  }
`;

export default function UserEntryBanner() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const userAdded = useCallback(({ subscriptionData }) => {
    const user = subscriptionData.data.newUser?.user;
    if (user && user.displayName) {
      setOpen(true);
      setMessage('\uD83C\uDF89 ' + user.displayName + ' joined the party! \uD83C\uDF89');
    }
  }, []);

  const userRemoved = useCallback(({ subscriptionData }) => {
    const user = subscriptionData.data.deletedUser?.user;
    if (user && user.displayName) {
      setOpen(true);
      setMessage('\uD83E\uDD7A ' + user.displayName + ' left the party \uD83E\uDD7A');
    }
  }, []);

  useSubscription(NEW_USER, {
    onSubscriptionData: userAdded,
  });

  useSubscription(REMOVED_USER, {
    onSubscriptionData: userRemoved,
  });

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    setOpen(false);
  };

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
