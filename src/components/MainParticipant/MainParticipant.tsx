import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import React from 'react';
import useMainSpeaker from '../../hooks/useMainSpeaker/useMainSpeaker';
import useMapItems from '../../hooks/useSync/useMapItems';

export default function MainParticipant() {
  const mainParticipant = useMainSpeaker();
  const users = useMapItems('users');

  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={mainParticipant} displayName={users[mainParticipant.identity]?.displayName}>
      <ParticipantTracks participant={mainParticipant} disableAudio enableScreenShare videoPriority="high" />
    </MainParticipantInfo>
  );
}
