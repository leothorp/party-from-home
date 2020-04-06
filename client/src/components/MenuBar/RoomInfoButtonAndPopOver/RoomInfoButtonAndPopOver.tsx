import React from 'react';
import { styled } from '@material-ui/core';
import useCurrentRoom from '../../../hooks/useCurrentRoom/useCurrentRoom';
import InfoIcon from '@material-ui/icons/Info';
import PopOverWithButton from '../../shared/PopOverWithButton/PopOverWithButton';

const IconContainer = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(1.5),
}));

const RoomRulesTitle = styled('div')({
  color: '#F2F2F2',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: '24px',
});

const RoomRulesContent = styled('div')({
  color: '#BEBEBE',
  fontSize: '16px',
  marginTop: 0,
});

export default function RoomInfoButtonAndPopOver() {
  const currentRoom = useCurrentRoom();
  const roomTitle = currentRoom?.name ? `Rules for the ${currentRoom.name}` : 'Room rules';
  const roomDescription = currentRoom?.description;

  return (
    <>
      {roomDescription && (
        <IconContainer>
          <PopOverWithButton buttonIconComponent={<InfoIcon />} popOverId="room-info-popover">
            <RoomRulesTitle>{roomTitle}</RoomRulesTitle>
            <RoomRulesContent>{roomDescription}</RoomRulesContent>
          </PopOverWithButton>
        </IconContainer>
      )}
    </>
  );
}
