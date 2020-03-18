import React from 'react';
import { styled } from '@material-ui/core/styles';
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

export default function RoomGrid() {
  return (
    <Container>
      <ContainerTitle>Party Rooms</ContainerTitle>
      <ItemContainer>
        {rooms.map(room => (
          <RoomGridItem key={room.id} title={room.name} />
        ))}
      </ItemContainer>
    </Container>
  );
}
