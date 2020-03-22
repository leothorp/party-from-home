import React from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { LocalParticipant, RemoteParticipant, Track } from 'twilio-video';

interface ParticipantProps {
  participant: LocalParticipant | RemoteParticipant;
  disableAudio?: boolean;
  enableScreenShare?: boolean;
  onClick: () => void;
  isSelected: boolean;
  displayName?: string;
  maxWidth?: number;
  videoPriority?: Track.Priority;
}

export default function Participant({
  participant,
  disableAudio,
  enableScreenShare,
  onClick,
  isSelected,
  displayName,
  maxWidth,
  videoPriority,
}: ParticipantProps) {
  return (
    <ParticipantInfo
      participant={participant}
      displayName={displayName}
      onClick={onClick}
      isSelected={isSelected}
      maxWidth={maxWidth}
    >
      <ParticipantTracks
        participant={participant}
        disableAudio={disableAudio}
        enableScreenShare={enableScreenShare}
        videoPriority={videoPriority}
      />
    </ParticipantInfo>
  );
}
