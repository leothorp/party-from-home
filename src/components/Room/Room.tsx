import React, { useCallback } from 'react';
import useCurrentRoom from '../../hooks/useCurrentRoom/useCurrentRoom';
import useApi from '../../hooks/useApi/useApi';
import ParticipantStrip from '../ParticipantStrip/ParticipantStrip';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import WidgetSelector from './WidgetSelector';
import { Button } from '@material-ui/core';

const Container = styled('div')({
  position: 'relative',
  height: '100%',
});

const MainParticipantContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: theme.sidebarWidth,
  right: 0,
  top: 0,
  bottom: 0,
  '& > div': {
    height: '100%',
  },
}));

export default function Room() {
  const room = useCurrentRoom();
  const { callApi } = useApi();

  const removeWidget = useCallback(() => {
    if (room) {
      callApi('delete_widget_state', {
        roomId: room.id,
      })
        .then(() => {})
        .catch(e => console.error(e));
    }
  }, [callApi, room]);

  const onWidgetSelected = useCallback(() => {}, []);

  return (
    <Container>
      {room?.widgetId ? (
        <Button onClick={removeWidget}>Remove Widget</Button>
      ) : (
        <WidgetSelector room={room} onWidgetSelected={onWidgetSelected} />
      )}
      <ParticipantStrip />
      <MainParticipantContainer>
        <MainParticipant />
      </MainParticipantContainer>
    </Container>
  );
}
