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
  cursor: 'pointer',
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
  id: string;
  title: string;
  participants: string[];
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
          <RoomParticipant></RoomParticipant>
        ))}
      </RoomParticipantContainer>
    </GridItem>
  );
}
