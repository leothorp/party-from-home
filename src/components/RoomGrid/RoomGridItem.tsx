import React from 'react';
import { styled } from '@material-ui/core/styles';

const GridItem = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  backgroundColor: '#333333',
  height: '235px',
  width: '264px',
  marginRight: '24px',
  padding: '17px',
});

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
});

const RoomParticipant = styled('div')({
  backgroundColor: '#EB5757',
  width: '48px',
  height: '48px',
  marginRight: '4px',
  marginBottom: '4px',
});

interface Props {
  title: string;
}

export default function RoomGridItem(props: Props) {
  return (
    <GridItem>
      <RoomTitle>{props.title}</RoomTitle>
      <RoomParticipantContainer>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
        <RoomParticipant></RoomParticipant>
      </RoomParticipantContainer>
    </GridItem>
  );
}
