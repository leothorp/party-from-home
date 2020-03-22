import React from 'react';
import { styled } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import { Participant } from './RoomGrid';

const GridItem = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper,
  height: '235px',
  width: '264px',
  marginRight: '24px',
  padding: '17px',
  cursor: 'pointer',
}));

const RoomTitle = styled('p')({
  color: '#F2F2F2',
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '29px',
  alignItems: 'center',
  marginTop: 0,
});

const RoomParticipantContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  overflow: 'scroll',
  '&::--webkit-scrollbar': {
    display: 'none',
  },
});

const RoomParticipant = styled('div')({
  width: '48px',
  height: '48px',
  borderRadius: '48px',
  marginRight: '4px',
  marginBottom: '4px',
  overflow: 'hidden',
});

const AvatarPlaceholder = styled('div')({
  width: '100%',
  height: '100%',
  backgroundColor: '#EB5757',
});

interface Props {
  id: string;
  title: string;
  participants: Participant[];
  onClick?: (id: string) => void;
}

export default function RoomGridItem(props: Props) {
  const onClick = () => {
    if (props.onClick) {
      props.onClick(props.id);
    }
  };

  return (
    <GridItem onClick={onClick}>
      <RoomTitle>{props.title}</RoomTitle>
      <RoomParticipantContainer>
        {props.participants.map(p => (
          <Tooltip key={p.uid} title={p.displayName}>
            <RoomParticipant>
              {p.photoURL ? <img alt="avatar" src={p.photoURL} /> : <AvatarPlaceholder />}
            </RoomParticipant>
          </Tooltip>
        ))}
      </RoomParticipantContainer>
    </GridItem>
  );
}
