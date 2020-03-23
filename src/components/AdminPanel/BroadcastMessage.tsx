import React, { useState, useCallback, useEffect } from 'react';
import { styled, TextField, Button } from '@material-ui/core';
import useList from '../../hooks/useSync/useList';
import { useAppState } from '../../state';

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

export default function RoomList() {
  const [broadcastedMessages, setBroadcastedMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const { user } = useAppState();

  const messageAdded = useCallback(
    (args: any) => {
      const message = args.item.value;

      setBroadcastedMessages([...broadcastedMessages, message]);
    },
    [broadcastedMessages]
  );

  const { list, addItem } = useList('broadcasts', {
    onAdded: messageAdded,
  });

  const onSubmitMessage = useCallback(() => {
    addItem({
      message: messageText,
      userName: user?.displayName,
      id: `broadcasted-message-${broadcastedMessages.length + 1}`,
    });
    setMessageText('');
  }, [addItem, broadcastedMessages.length, messageText, user]);

  return (
    <>
      <h2>Broadcasted messages</h2>
      <Container>
        <CommandContainer>
          <TextField label="Your message" value={messageText} onChange={e => setMessageText(e.target.value)} />
          <Button onClick={onSubmitMessage}>Send broadcast</Button>
        </CommandContainer>
        {broadcastedMessages.length > 0 && (
          <List>
            <h3>Your previous messages</h3>
            {broadcastedMessages.map(msg => (
              <ListItem key={msg.id}>{msg.message}</ListItem>
            ))}
          </List>
        )}
      </Container>
    </>
  );
}
