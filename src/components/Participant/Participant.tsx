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
  isSelected: boolean;
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
  isSelected,
  maxWidth,
  maxHeight,
  videoPriority,
  overlays,
}: ParticipantProps) {
  return (
    <ParticipantScreen
      participant={participant}
      onClick={onClick}
      isSelected={isSelected}
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
