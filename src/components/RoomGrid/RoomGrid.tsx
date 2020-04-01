import React, { useState, useCallback } from 'react';
import useMountEffect from '../../hooks/useMountEffect/useMountEffect';
import useRooms from '../../hooks/partyHooks/useRooms';
import useUsers from '../../hooks/partyHooks/useUsers';
import { styled } from '@material-ui/core/styles';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { useAppState } from '../../state';
import useConnectRoom from '../../hooks/useConnectRoom';
import RoomGridItem from './RoomGridItem';

interface ContainerProps {
  open: boolean;
}

const Container = styled('div')((props: ContainerProps) => ({
  position: 'fixed',
  bottom: '0',
  left: '0',
  width: '100%',
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'column',
  height: props.open ? '374px' : '70px',
  transition: 'height 0.2s ease-out',
}));

const HeaderContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '248px',
  marginTop: 0,
  marginLeft: '16px',
  cursor: 'pointer',
  padding: '21px',
  backgroundColor: theme.alternateBackgroundColor,
  borderRadius: '15px 15px 0 0',
}));

const BodyContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.alternateBackgroundColor,
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'column',
  paddingTop: '32px',
  paddingLeft: '32px',
  height: '100%',
}));

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

export interface Participant {
  identity: string;
  displayName: string | undefined;
  photoURL: string | undefined;
}

interface Participants {
  [key: string]: Participant[];
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
  const { user } = useAppState();
  const [open, setOpen] = useState(false);
  const { rooms } = useRooms();
  const { users } = useUsers();
  const connectRoom = useConnectRoom();

  const onSelectRoom = useCallback(
    (id: string) => {
      if (id !== undefined && id !== 'bathroom') connectRoom(id);
      setOpen(false);
    },
    [connectRoom]
  );

  // todo(carlos): move this to app state
  useMountEffect(() => {
    setInterval(heartbeat(user?.identity || ''), HEARTBEAT_INTERVAL);
  });

  const participants: Record<string, any[]> = {};

  for (const u of users) {
    const currentRoom = u.room || 'bathroom';
    if (currentRoom in participants) {
      participants[currentRoom]?.push(u);
    } else {
      participants[currentRoom] = [u];
    }
  }

  const displayRooms: any[] = [];

  for (const id in rooms) {
    displayRooms.push(rooms[id]);
  }

  displayRooms.push({
    id: 'bathroom',
    name: 'Bathroom',
    description: 'This is the bathroom, take a break from the party.',
  });

  return (
    <Container open={open}>
      <Header onClick={() => setOpen(!open)} open={open} />
      <BodyContainer>
        <ItemContainer>
          {displayRooms.map((rm: any) => (
            <RoomGridItem
              key={rm.id}
              id={rm.id}
              title={rm.name}
              participants={participants[rm.id] || []}
              onClick={onSelectRoom}
            />
          ))}
        </ItemContainer>
      </BodyContainer>
    </Container>
  );
}
