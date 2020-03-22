import React, { useState, useCallback, useEffect } from 'react';
import { styled, TextField, Button, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import useMap from '../../hooks/useSync/useMap';
import useApi from '../../hooks/useApi/useApi';

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
  const [rooms, setRooms] = useState<any[]>([]);
  const [name, setName] = useState('');
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
      });
    },
    [callApi]
  );

  return (
    <>
      <h2>Room list</h2>
      <Container>
        <List>
          {rooms.map(room => (
            <ListItem key={room.id}>
              {room.name}
              <IconButton onClick={() => onRemove(room.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <CommandContainer>
          <TextField label="Room Name" value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Description" multiline value={description} onChange={e => setDescription(e.target.value)} />
          <Button onClick={onAdd}>Create Room</Button>
        </CommandContainer>
      </Container>
    </>
  );
}
