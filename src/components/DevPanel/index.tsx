import React, { useCallback } from 'react';
import { Modal, styled, Typography, Slider, Select, MenuItem } from '@material-ui/core';
import useMocks from '../../dev/useMocks';

const Container = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  backgroundColor: theme.alternateBackgroundColor,
  width: '400px',
  height: '500px',
  marginTop: '-250px',
  marginLeft: '-200px',
  display: 'flex',
  flexDirection: 'column',
  outline: 'none',
  padding: '16px',
  overflow: 'scroll',
}));

interface Props {
  open: boolean;
  onClose?: () => void;
}

export default function DevPanel(props: Props) {
  const { participantCount, setParticipantCount, dominantSpeaker, setDominantSpeaker, participants } = useMocks();
  const onClose = useCallback(() => {
    if (props.onClose) {
      props.onClose();
    }
  }, [props]);

  const onChangeDominant = useCallback(
    (e: any) => {
      setDominantSpeaker(participants.find((p: any) => p.identity === e.target.value));
    },
    [participants, setDominantSpeaker]
  );

  return (
    <Modal open={props.open} onClose={onClose}>
      <Container>
        <h1>Developer Controls</h1>
        <Typography gutterBottom>Fake Participants</Typography>
        <Slider
          step={1}
          min={0}
          max={49}
          value={participantCount}
          onChangeCommitted={(_e, value) => setParticipantCount(value)}
          valueLabelDisplay="on"
        />
        <Select value={dominantSpeaker?.identity} onChange={onChangeDominant}>
          {participants.map((p: any) => (
            <MenuItem key={p.identity} value={p.identity}>
              {p.identity}
            </MenuItem>
          ))}
        </Select>
      </Container>
    </Modal>
  );
}
