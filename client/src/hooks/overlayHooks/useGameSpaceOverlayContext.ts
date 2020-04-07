import { useContext } from 'react';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import useParticipants from '../useParticipants/useParticipants';
import useVideoContext from '../useVideoContext/useVideoContext';
import { GameSpaceOverlayContext } from '../../components/ParticipantScreen/Overlays/GameSpaceOverlays/GameSpaceOverlay/GameSpaceOverlayProvider';

export default function useGameSpaceOverlayContext(): { participant: LocalParticipant | RemoteParticipant } {
  const context = useContext(GameSpaceOverlayContext);
  if (!context) {
    throw new Error('useGameSpaceOverlayContext must be used within a GameSpaceOverlayProvider');
  }

  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const participant: LocalParticipant | RemoteParticipant | undefined =
    localParticipant.identity === context.participantId
      ? localParticipant
      : participants.find(p => p.identity === context.participantId);

  if (!participant) {
    throw new Error(`In useGameSpaceOverlayContext : participant with id ${context.participantId} was not found`);
  }

  return { participant };
}
