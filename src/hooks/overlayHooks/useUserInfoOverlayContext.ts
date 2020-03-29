import { useContext } from 'react';
import { UserInfoOverlayContext } from '../../components/ParticipantScreen/Overlays/UserInfoOverlays/UserInfoOverlay/UserInfoOverlayProvider';
import useParticipants from '../useParticipants/useParticipants';
import useVideoContext from '../useVideoContext/useVideoContext';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';

export default function useUserInfoOverlayContext(): { participant: LocalParticipant | RemoteParticipant } {
  const context = useContext(UserInfoOverlayContext);
  if (!context) {
    throw new Error('useUserInfoOverlayContext must be used within a UserInfoOverlayProvider');
  }

  const {
    room: { localParticipant },
  } = useVideoContext();
  let participant: LocalParticipant | RemoteParticipant | undefined =
    localParticipant.identity === context.participantId ? localParticipant : undefined;
  const participants = useParticipants();
  participant = participants.find(p => p.identity === context.participantId);

  if (!participant) {
    throw new Error(`In useUserInfoOverlayContext : participant with id ${context.participantId} was not found`);
  }

  return { participant };
}
