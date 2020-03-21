import React, { useCallback, useEffect, useState } from 'react';
import useCurrentRoom from '../../hooks/useCurrentRoom/useCurrentRoom';
import useApi from '../../hooks/useApi/useApi';
import ParticipantStrip from '../ParticipantStrip/ParticipantStrip';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import WidgetSelector from './WidgetSelector';
import { Button } from '@material-ui/core';
import RoomWidget from '../RoomWidget/RoomWidget';
import { Responsive, WidthProvider } from 'react-grid-layout';

const GridLayout = WidthProvider(Responsive);

const Container = styled('div')({
  position: 'relative',
  height: '100%',
});

const MainParticipantContainer = styled('div')(({ theme }) => ({
  // position: 'absolute',
  // left: theme.sidebarWidth,
  // right: 0,
  // top: 0,
  // bottom: 0,
  '& > div:not(.room-controls)': {
    height: '100%',
  },
}));

const RoomControlsContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  height: '100px',
  left: '50%',
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 100,
  marginLeft: '-300px',
  width: '600px',
}));

const Part = styled('div')({
  // width: '100%',
  // height: '100%',
  backgroundColor: 'red',
});

const getRoomLayout = (participants: any[], primarySpeaker: number, cols: number) => {
  const layout = [];
  var x = 0;
  var y = 0;
  var px = primarySpeaker % cols;
  var py = Math.floor(primarySpeaker / cols);
  const w = 3;
  const h = 2.8;

  // Edge correction assumes w < cols and h < height
  if (px >= cols - Math.ceil(w)) {
    console.log(`Speaker ${primarySpeaker} too far right`);
    const newPrimarySpeaker = primarySpeaker + (cols - (px + Math.ceil(w)));
    // dominant is too far to right
    const otherParticipant = participants[newPrimarySpeaker];
    participants[newPrimarySpeaker] = participants[primarySpeaker];
    participants[primarySpeaker] = otherParticipant;

    primarySpeaker = newPrimarySpeaker;
    px = newPrimarySpeaker % cols;
    console.log(`New index: ${primarySpeaker}, new X: ${px}`);
  }

  if (py >= Math.floor(participants.length / cols) - Math.ceil(h)) {
    console.log(`Speaker ${primarySpeaker} too far down`);
    // dominant is too far down
    const newY = py + (Math.floor(participants.length / cols) - (py + Math.ceil(h)) + 1);
    const newPrimarySpeaker = newY * cols + px;
    const otherParticipant = participants[newPrimarySpeaker];
    participants[newPrimarySpeaker] = participants[primarySpeaker];
    participants[primarySpeaker] = otherParticipant;

    primarySpeaker = newPrimarySpeaker;
    py = newY;
    console.log(`New index: ${primarySpeaker}, new Y: ${py}`);
  }

  for (var i = 0; i < participants.length; i++) {
    if (i === primarySpeaker) {
      layout.push({ i: i.toString(), x: x, y: y, w, h, static: true });
    } else {
      layout.push({ i: i.toString(), x: x, y: y, w: 1, h: 1, static: true });
    }

    if (y >= py && y < py + Math.ceil(h)) {
      if (y === py && x === px) {
        x += Math.ceil(w);
      } else if (y !== py && x + 1 === px) {
        x += Math.ceil(w) + 1;
      } else {
        x += 1;
      }
    } else {
      x += 1;
    }

    if (x >= cols) {
      y += 1;

      if (px === 0 && y >= py && y < py + Math.ceil(h)) {
        x = Math.ceil(w);
      } else {
        x = 0;
      }
    }
  }

  console.log(layout);

  return [layout, participants];
};

export default function Room() {
  const room = useCurrentRoom();
  const { callApi } = useApi();
  const [dominant, setDominant] = useState(0);

  const domTimer = useCallback(() => {
    setInterval(() => {
      setDominant(Math.floor(Math.random() * 49));
    }, 3000);
  }, [setDominant]);

  useEffect(() => {
    domTimer();
  }, [domTimer]);

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

  const columns = 12;

  const participants = [
    { color: '#000' },
    { color: '#F00' },
    { color: '#0F0' },
    { color: '#00F' },
    { color: '#000' },
    { color: '#F00' },
    { color: '#0F0' },
    { color: '#00F' },
    { color: '#000' },
    { color: '#F00' },
    { color: '#0F0' },
    { color: '#00F' },
    { color: '#000' },
    { color: '#F00' },
    { color: '#0F0' },
    { color: '#00F' },
    { color: '#000' },
    { color: '#F00' },
    { color: '#0F0' },
    { color: '#00F' },
    { color: '#00F' },
    { color: '#000' },
    { color: '#F00' },
    { color: '#0F0' },
    { color: '#00F' },
    { color: '#000' },
    { color: '#F00' },
    { color: '#0F0' },
    { color: '#00F' },
    { color: '#000' },
    { color: '#F00' },
    { color: '#0F0' },
    { color: '#00F' },
    { color: '#000' },
    { color: '#F00' },
    { color: '#0F0' },
    { color: '#00F' },
    { color: '#000' },
    { color: '#F00' },
    { color: '#0F0' },
    { color: '#00F' },
    { color: '#00F' },
    { color: '#000' },
    { color: '#F00' },
    { color: '#0F0' },
    { color: '#00F' },
    { color: '#000' },
    { color: '#F00' },
    { color: '#0F0' },
    { color: '#00F' },
    { color: '#000' },
    { color: '#F00' },
  ];

  const [layout, layoutParticipants] = getRoomLayout(participants, dominant, columns);

  return (
    <Container>
      <GridLayout
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: columns, md: columns, sm: columns, xs: columns, xxs: columns }}
        rowHeight={170}
        margin={[4, 4]}
        useCSSTransforms={true}
      >
        {/* <MainParticipantContainer key="main">
          {room?.widgetId ? (
            <RoomWidget widgetId={room.widgetId} documentId={room.widgetStateId} />
          ) : (
            <MainParticipant />
          )}
        </MainParticipantContainer> */}
        {layoutParticipants.map((p, i) => (
          <Part key={i} style={{ backgroundColor: p.color }} />
        ))}
      </GridLayout>
    </Container>
  );
}

// <ParticipantStrip />

// <RoomControlsContainer className="room-controls">
//   {room?.widgetId ? (
//     <Button onClick={removeWidget}>Remove Widget</Button>
//   ) : (
//     <WidgetSelector room={room} onWidgetSelected={onWidgetSelected} />
//   )}
// </RoomControlsContainer>
