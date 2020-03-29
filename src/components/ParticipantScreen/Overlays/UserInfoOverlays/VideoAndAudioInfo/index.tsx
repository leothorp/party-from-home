import React from 'react';
import { VideocamOff, MicOff, ScreenShare } from '@material-ui/icons';
import useUserInfoOverlayContext from '../../../../../hooks/overlayHooks/useUserInfoOverlayContext';
import usePublications from '../../../../../hooks/usePublications/usePublications';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import usePublicationIsTrackEnabled from '../../../../../hooks/usePublicationIsTrackEnabled/usePublicationIsTrackEnabled';

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
      {!isAudioEnabled && <MicOff data-cy-audio-mute-icon />}
      {!isVideoEnabled && <VideocamOff />}
      {isScreenShareEnabled && <ScreenShare />}
    </>
  );
}
