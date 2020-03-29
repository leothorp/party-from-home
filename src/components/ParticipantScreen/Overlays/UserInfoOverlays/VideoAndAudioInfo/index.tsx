import React from 'react';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import { VideocamOff, MicOff, ScreenShare } from '@material-ui/icons';
import { styled } from '@material-ui/core';
import useUserInfoOverlayContext from '../../../../../hooks/overlayHooks/useUserInfoOverlayContext';
import usePublications from '../../../../../hooks/usePublications/usePublications';
import usePublicationIsTrackEnabled from '../../../../../hooks/usePublicationIsTrackEnabled/usePublicationIsTrackEnabled';

const ImageContainer = styled('div')({
  display: 'inline-block',
});

export default function VideoAndAudioInfo() {
  const { participant }: { participant: LocalParticipant | RemoteParticipant } = useUserInfoOverlayContext();

  const publications = usePublications(participant);
  const audioPublication = publications.find((p: any) => p.kind === 'audio');
  const isAudioEnabled = usePublicationIsTrackEnabled(audioPublication);
  const videoPublication = publications.find(p => p.trackName === 'camera');
  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find(p => p.trackName === 'screen');

  return (
    <>
      {!isAudioEnabled && (
        <ImageContainer>
          <MicOff data-cy-audio-mute-icon />
        </ImageContainer>
      )}
      {!isVideoEnabled && (
        <ImageContainer>
          <VideocamOff />
        </ImageContainer>
      )}
      {isScreenShareEnabled && (
        <ImageContainer>
          <ScreenShare />
        </ImageContainer>
      )}
    </>
  );
}
