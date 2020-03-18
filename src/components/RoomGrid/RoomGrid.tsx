import React, { useState } from 'react';
import useMountEffect from '../../hooks/useMountEffect/useMountEffect';
import { styled } from '@material-ui/core/styles';
import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import SyncClient from 'twilio-sync';
import RoomGridItem from './RoomGridItem';
import { rooms } from '../../rooms';

const Container = styled('div')({
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'column',
  backgroundColor: '#1F1F1F',
  height: '374px',
  paddingLeft: '32px',
});

const ContainerTitle = styled('p')({
  color: '#E0E0E0',
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '29px',
  alignItems: 'center',
});

const ItemContainer = styled('div')({
  display: 'flex',
  flexWrap: 'nowrap',
  overflowX: 'auto',
  flex: 1,
});

interface Participants {
  [key: string]: string[];
}

// todo(carlos): probably should be somewhere else, higher level,
// after we implement the auth flow
const heartbeat = (identity: string) => {
  return () => {
    fetch(`/api/heartbeat?identity=${identity}`).then(() => {
      console.log('Sent heartbeat');
    });
  };
};

export default function RoomGrid() {
  const { getToken } = useAppState();
  const { connect, room } = useVideoContext();
  const roomState = useRoomState();
  const [participants, setParticipants] = useState<Participants>({});

  const onSelectRoom = (id: string) => {
    if (roomState !== 'disconnected') room.disconnect();
    getToken('CARLOS', id).then(token => connect(token));
  };

  useMountEffect(() => {
    setInterval(heartbeat('CARLOS'), 10000);

    fetch(`/api/sync_token?identity=CARLOS`).then(res => {
      res.text().then(token => {
        const syncClient = new SyncClient(token);

        syncClient.map(`users`).then((map: any) => {
          map.getItems().then((paginator: any) => {
            const roomParticipants: Participants = {};

            paginator.items.forEach((item: any) => {
              if (item.value.room !== undefined) {
                if (roomParticipants[item.value.room]) {
                  roomParticipants[item.value.room].push(item.value.identity);
                } else {
                  roomParticipants[item.value.room] = [item.value.identity];
                }
              }
            });

            setParticipants(roomParticipants);
          });

          map.on('itemAdded', (args: any) => {
            const value = args.item.value;
            const roomParticipants = { ...participants };

            if (value.room !== undefined) {
              if (roomParticipants[value.room]) {
                roomParticipants[value.room].push(value.identity);
              } else {
                roomParticipants[value.room] = [value.identity];
              }

              setParticipants(roomParticipants);
            }
          });

          map.on('itemRemoved', (args: any) => {
            const value = args.item.value;
            const roomParticipants = { ...participants };

            if (value.room !== undefined) {
              if (roomParticipants[value.room]) {
                const idx = roomParticipants[value.room].indexOf(value.identity);
                if (idx >= 0) {
                  roomParticipants[value.room].splice(idx, 1);
                  setParticipants(roomParticipants);
                }
              }
            }
          });

          map.on('itemUpdated', (args: any) => {
            const value = args.item.value;
            const roomParticipants = { ...participants };

            for (const roomName in roomParticipants) {
              const roomUsers = roomParticipants[roomName];
              const idx = roomUsers.indexOf(value.identity);
              if (idx >= 0) {
                roomUsers.splice(idx, 1);
              }
            }

            if (value.room !== undefined) {
              if (roomParticipants[value.room]) {
                roomParticipants[value.room].push(value.identity);
              } else {
                roomParticipants[value.room] = [value.identity];
              }
            }

            setParticipants(roomParticipants);
          });
        });
      });
    });
  });

  return (
    <Container>
      <ContainerTitle>Party Rooms</ContainerTitle>
      <ItemContainer>
        {rooms.map(room => (
          <RoomGridItem
            key={room.id}
            id={room.id}
            title={room.name}
            participants={participants[room.id] || []}
            onClick={onSelectRoom}
          />
        ))}
      </ItemContainer>
    </Container>
  );
}
