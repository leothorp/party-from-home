import { useContext } from 'react';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import useParticipants from '../useParticipants/useParticipants';
import useVideoContext from '../useVideoContext/useVideoContext';
import { EphemeralOverlayContext } from '../../components/ParticipantScreen/Overlays/EphemeralOverlays/EphemeralOverlay/EphemeralOverlayProvider';

export default function useEphemeralOverlayContext(): { participant: LocalParticipant | RemoteParticipant } {
  const context = useContext(EphemeralOverlayContext);
  if (!context) {
    throw new Error('useEphemeralOverlayContext must be used within a EphemeralOverlayProvider');
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
    throw new Error(`In useEphemeralOverlayContext : participant with id ${context.participantId} was not found`);
  }

  return { participant };
}
