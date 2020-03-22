import React, { ReactChild } from 'react';
import Participant from '../Participant/Participant';
import { styled } from '@material-ui/core/styles';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useMapItems from '../../hooks/useSync/useMapItems';
import { Responsive, WidthProvider } from 'react-grid-layout';
import useMainSpeaker from '../../hooks/useMainSpeaker/useMainSpeaker';

const GridLayout = WidthProvider(Responsive);

// todo(carlos): allow for different layout strategies
const getRoomLayout = (participants: any[], primarySpeaker: number) => {
  const layout = [];
  const total = participants.length;
  var columns = 2;
  var pWidth = 1;
  var pHeight = 1;
  var rowHeight = 680;

  if (total <= 4) {
    columns = 2;
    rowHeight = 340;
  } else if (total <= 16) {
    columns = 4;
    rowHeight = 170;
  } else if (total <= 24) {
    columns = 6;
    pWidth = 2;
    pHeight = 1;
    rowHeight = 170;
  } else if (total <= 32) {
    columns = 8;
    pWidth = 3;
    pHeight = 2.8;
    rowHeight = 170;
  } else if (total <= 40) {
    columns = 10;
    pWidth = 3;
    pHeight = 2.8;
    rowHeight = 170;
  } else {
    columns = 12;
    pWidth = 3;
    pHeight = 2.8;
    rowHeight = 170;
  }

  var x = 0;
  var y = 0;
  var px = primarySpeaker % columns;
  var py = Math.floor(primarySpeaker / columns);
  const w = pWidth;
  const h = pHeight;

  // Edge correction assumes w < cols and h < height
  if (px > columns - Math.ceil(w)) {
    console.log(`Speaker ${primarySpeaker} too far right`);
    const newPrimarySpeaker = primarySpeaker + (columns - (px + Math.ceil(w)));
    // dominant is too far to right
    const otherParticipant = participants[newPrimarySpeaker];
    participants[newPrimarySpeaker] = participants[primarySpeaker];
    participants[primarySpeaker] = otherParticipant;

    primarySpeaker = newPrimarySpeaker;
    px = newPrimarySpeaker % columns;
    console.log(`New index: ${primarySpeaker}, new X: ${px}`);
  }

  if (py > Math.floor(participants.length / columns) - Math.ceil(h)) {
    console.log(`Speaker ${primarySpeaker} too far down`);
    // dominant is too far down
    const newY = py + (Math.floor(participants.length / columns) - (py + Math.ceil(h)) + 1);
    const newPrimarySpeaker = newY * columns + px;
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

    if (x >= columns) {
      y += 1;

      if (px === 0 && y >= py + 1 && y < py + Math.ceil(h)) {
        x = Math.ceil(w);
      } else {
        x = 0;
      }
    }
  }

  return { layout, layoutParticipants: participants, columns, rowHeight };
};

const WidgetContainer = styled('div')({});

export interface Props {
  children?: ReactChild | ReactChild[] | undefined;
}

export default function ParticipantStrip(props: Props) {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const speaker = useMainSpeaker();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();
  const users = useMapItems('users');

  const localIdentity = localParticipant.identity;
  const roomParticipants: any[] = [];
  var dominant = -1;

  if (props.children) {
    // special case to render widget
    roomParticipants.push('widget');
    dominant = 0;
  }

  roomParticipants.push(localParticipant);
  roomParticipants.push(...participants);

  if (dominant < 0) dominant = roomParticipants.findIndex(p => p.identity === speaker.identity);

  const { layout, layoutParticipants, columns, rowHeight } = getRoomLayout(roomParticipants, dominant);

  const basePriority = participants.length > 10 ? 'low' : 'standard';

  return (
    <GridLayout
      layouts={{ lg: layout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: columns, md: columns, sm: columns, xs: columns, xxs: columns }}
      rowHeight={rowHeight}
      margin={[4, 4]}
      useCSSTransforms={true}
    >
      {layoutParticipants.map((participant, i) => {
        if (participant === 'widget') {
          return (
            <div key={i}>
              <WidgetContainer key={i}>{props.children}</WidgetContainer>
            </div>
          );
        } else {
          return (
            <div key={i}>
              <Participant
                key={i}
                participant={participant}
                isSelected={selectedParticipant === participant}
                onClick={() => setSelectedParticipant(participant)}
                displayName={users[participant.identity]?.displayName}
                maxWidth={layout[i].w * (rowHeight / 0.5625)}
                videoPriority={i === dominant || participant.identity === localIdentity ? 'high' : basePriority}
                enableScreenShare={i === dominant}
              />
            </div>
          );
        }
      })}
    </GridLayout>
  );
}
