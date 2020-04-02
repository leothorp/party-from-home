import React, { useState, useCallback } from 'react';
import { styled, TextField, Button } from '@material-ui/core';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
}));

const CommandContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
});

const List = styled('ul')({});

const ListItem = styled('li')({});

const GET_BROADCASTS = gql`
  {
    broadcasts {
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

const SEND_BROADCAST = gql`
  mutation SendBroadcast($message: String!) {
    broadcast(message: $message) {
      id
      message
    }
  }
`;

export default function RoomList() {
  const [messageText, setMessageText] = useState('');
  const { data, loading } = useQuery(GET_BROADCASTS);
  const [sendBroadcast] = useMutation(SEND_BROADCAST);

  const onSubmitMessage = useCallback(() => {
    sendBroadcast({
      variables: { message: messageText },
    });
    setMessageText('');
  }, [messageText, sendBroadcast]);

  return (
    <>
      <h2>Broadcasted messages</h2>
      <Container>
        <CommandContainer>
          <TextField label="Your message" value={messageText} onChange={e => setMessageText(e.target.value)} />
          <Button onClick={onSubmitMessage}>Send broadcast</Button>
        </CommandContainer>
        {!loading && data && (
          <List>
            <h3>Your previous messages</h3>
            {data.broadcasts.map((msg: any) => (
              <ListItem key={msg.id}>
                {msg.user.displayName}: {msg.message}
              </ListItem>
            ))}
          </List>
        )}
      </Container>
    </>
  );
}
