import React, { useState, useCallback } from 'react';
import { styled, TextField, Button, IconButton, List, ListItem, Switch, FormControlLabel } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import useRooms from '../../hooks/partyHooks/useRooms';
import useRoom from '../../hooks/partyHooks/useRoom';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  padding: '10px',
}));

const CommandContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
});

const SettingsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

export default function RoomList() {
  const [name, setName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<any | undefined>(undefined);
  const { rooms, createRoom, deleteRoom } = useRooms();
  const { getRoom, updateRoom } = useRoom({
    onReceive: r => {
      setSelectedRoom(r);
    },
  });

  const onAdd = useCallback(() => {
    createRoom(name);

    setName('');
  }, [createRoom, name]);

  const onRemove = useCallback(
    (id: string) => {
      deleteRoom(id);
      setSelectedRoom(undefined);
    },
    [deleteRoom]
  );

  const changeSelectedRoom = useCallback(
    (data: any) => {
      setSelectedRoom({
        ...selectedRoom,
        ...data,
      });
    },
    [selectedRoom, setSelectedRoom]
  );

  const onUpdate = useCallback(() => {
    if (selectedRoom) {
      updateRoom({
        name: selectedRoom.name,
        description: selectedRoom.description,
        adminScreenshare: selectedRoom.adminScreenshare,
        disableWidgets: selectedRoom.disableWidgets,
        adminStartGames: selectedRoom.adminStartGames,
      });

      setSelectedRoom(undefined);
    }
  }, [selectedRoom, updateRoom]);

  return (
    <>
      <h2>Room list</h2>
      <Container>
        <List component="nav">
          {rooms.map(room => (
            <ListItem key={room.id} button onClick={() => getRoom(room.id)}>
              {room.name}
            </ListItem>
          ))}
        </List>
        {selectedRoom ? (
          <>
            <h3>
              Editing Room
              <IconButton onClick={() => onRemove(selectedRoom.id)}>
                <DeleteIcon />
              </IconButton>
            </h3>
            <SettingsContainer>
              <TextField
                label="Room Name"
                value={selectedRoom.name}
                onChange={e => changeSelectedRoom({ name: e.target.value })}
              />
              <TextField
                label="Description"
                multiline
                value={selectedRoom.description}
                onChange={e => changeSelectedRoom({ description: e.target.value })}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedRoom.adminScreenshare}
                    onChange={e => changeSelectedRoom({ adminScreenshare: e.target.checked })}
                  />
                }
                label="Only Admins can share screen"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedRoom.disableWidgets}
                    onChange={e => changeSelectedRoom({ disableWidgets: e.target.checked })}
                  />
                }
                label="Disable Game Widgets"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedRoom.adminStartGames}
                    onChange={e => changeSelectedRoom({ adminStartGames: e.target.checked })}
                  />
                }
                label="Only Admins can start games"
              />
              <Button onClick={onUpdate}>Save Changes</Button>
            </SettingsContainer>
          </>
        ) : (
          <>
            <h3>Create Room</h3>
            <CommandContainer>
              <TextField label="Room Name" value={name} onChange={e => setName(e.target.value)} />
              <Button onClick={onAdd}>Create Room</Button>
            </CommandContainer>
          </>
        )}
      </Container>
    </>
  );
}
