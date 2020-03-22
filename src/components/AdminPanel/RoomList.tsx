import React, { useState, useCallback, useEffect } from 'react';
import { styled, TextField, Button, IconButton, List, ListItem, Switch, FormControlLabel } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import useMap from '../../hooks/useSync/useMap';
import useApi from '../../hooks/useApi/useApi';

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
  const [rooms, setRooms] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<any | undefined>(undefined);
  const [description, setDescription] = useState('');
  const { callApi } = useApi();

  const roomAdded = useCallback(
    (args: any) => {
      const room = args.item.value;

      setRooms([...rooms, room]);
    },
    [rooms]
  );

  const roomRemoved = useCallback(
    (item: any) => {
      const room = item.value;

      setRooms(rooms.filter(r => r.id !== room.id));
    },
    [rooms]
  );

  const roomUpdated = useCallback(
    (args: any) => {
      const room = args.item.value;

      setRooms(
        rooms.map(r => {
          if (r.id === room.id) {
            return room;
          } else {
            return r;
          }
        })
      );
    },
    [rooms]
  );

  const { map } = useMap('rooms', {
    onAdded: roomAdded,
    onRemoved: roomRemoved,
    onUpdated: roomUpdated,
  });

  useEffect(() => {
    map?.getItems().then((paginator: any) => {
      setRooms(paginator.items.map((i: any) => i.value));
    });
  }, [map]);

  const onAdd = useCallback(() => {
    callApi('create_room', {
      name,
      description,
    });

    setName('');
    setDescription('');
  }, [callApi, name, description]);

  const onRemove = useCallback(
    (id: string) => {
      callApi('delete_room', {
        roomId: id,
      }).then(() => {
        setSelectedRoom(undefined);
      });
    },
    [callApi, setSelectedRoom]
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
      callApi('update_room', {
        roomId: selectedRoom.id,
        ...selectedRoom,
      })
        .then(() => {
          setSelectedRoom(undefined);
        })
        .catch(e => console.log(e));
    }
  }, [callApi, selectedRoom]);

  return (
    <>
      <h2>Room list</h2>
      <Container>
        <List component="nav">
          {rooms.map(room => (
            <ListItem key={room.id} button onClick={() => setSelectedRoom(room)}>
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
