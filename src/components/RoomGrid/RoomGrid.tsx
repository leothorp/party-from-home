import React, { useState } from 'react';
import useMountEffect from '../../hooks/useMountEffect/useMountEffect';
import { styled } from '@material-ui/core/styles';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import SyncClient from 'twilio-sync';
import RoomGridItem from './RoomGridItem';
import { rooms } from '../../rooms';

interface ContainerProps {
  open: boolean;
}

const Container = styled('div')((props: ContainerProps) => ({
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'column',
  backgroundColor: '#1F1F1F',
  height: props.open ? '374px' : '70px',
  paddingLeft: '32px',
}));

const HeaderContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginTop: 0,
  cursor: 'pointer',
  padding: '21px',
});

const ContainerTitle = styled('p')({
  margin: 0,
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

const HEARTBEAT_INTERVAL = 100000;

// todo(carlos): probably should be somewhere else, higher level,
// after we implement the auth flow
const heartbeat = (identity: string) => {
  return () => {
    fetch(`/api/heartbeat?identity=${identity}`).then(() => {
      console.log('Sent heartbeat');
    });
  };
};

interface HeaderProps {
  onClick: () => void;
  open: boolean;
}

const Header = (props: HeaderProps) => {
  return (
    <HeaderContainer onClick={props.onClick}>
      <ContainerTitle>Party Rooms</ContainerTitle>
      {props.open ? <ExpandMore fontSize="large" /> : <ExpandLess fontSize="large" />}
    </HeaderContainer>
  );
};

export default function RoomGrid() {
  const { getToken, user } = useAppState();
  const { connect, room } = useVideoContext();
  const roomState = useRoomState();
  const [participants, setParticipants] = useState<Participants>({});
  const [open, setOpen] = useState(false);

  const onSelectRoom = (id: string) => {
    if (roomState !== 'disconnected') room.disconnect();
    getToken(user?.uid || '', id).then(token => connect(token));
  };

  useMountEffect(() => {
    setInterval(heartbeat(user?.uid || ''), HEARTBEAT_INTERVAL);

    fetch(`/api/sync_token?identity=${user?.uid}`).then(res => {
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
    <Container open={open}>
      <Header onClick={() => setOpen(!open)} open={open} />
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
