import React from 'react';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import { styled } from '@material-ui/core/styles';
import useParticipantNetworkQualityLevel from '../../../../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import useUserInfoOverlayContext from '../../../../../hooks/overlayHooks/useUserInfoOverlayContext';

const ImageContainer = styled('div')({
  display: 'inline-block',
  paddingTop: '6px',
  paddingLeft: '2px',
});

const Container = styled('div')({
  display: 'flex',
  alignItems: 'flex-end',
  '& div': {
    width: '2px',
    border: '1px solid black',
    boxSizing: 'content-box',
    '&:not(:last-child)': {
      borderRight: 'none',
    },
  },
});

const STEP = 3;

export default function NetworkQualityLevel() {
  const {
    participant,
  }: { participant: LocalParticipant | RemoteParticipant | undefined } = useUserInfoOverlayContext();
  const qualityLevel = useParticipantNetworkQualityLevel(participant);

  if (qualityLevel === null) return null;
  return (
    <ImageContainer>
      <Container>
        {[0, 1, 2, 3, 4].map(level => (
          <div
            key={level}
            style={{
              height: `${STEP * (level + 1)}px`,
              background: qualityLevel > level ? '#0c0' : '#040',
            }}
          />
        ))}
      </Container>
    </ImageContainer>
  );
}
