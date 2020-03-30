import React from 'react';
import ParticipantScreen from '../ParticipantScreen';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { LocalParticipant, RemoteParticipant, Track } from 'twilio-video';
import { Overlays } from '../../Overlay';

interface ParticipantProps {
  participant: LocalParticipant | RemoteParticipant;
  disableAudio?: boolean;
  enableScreenShare?: boolean;
  onClick: () => void;
  displayName?: string;
  maxWidth?: number;
  maxHeight?: number;
  videoPriority?: Track.Priority;
  overlays?: Overlays;
}

export default function Participant({
  participant,
  disableAudio,
  enableScreenShare,
  onClick,
  maxWidth,
  maxHeight,
  videoPriority,
  overlays,
}: ParticipantProps) {
  return (
    <ParticipantScreen
      participant={participant}
      onClick={onClick}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      overlays={overlays}
    >
      <ParticipantTracks
        participant={participant}
        disableAudio={disableAudio}
        enableScreenShare={enableScreenShare}
        videoPriority={videoPriority}
      />
    </ParticipantScreen>
  );
}
