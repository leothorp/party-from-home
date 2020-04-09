import { useContext } from 'react';
import { UserInfoOverlayContext } from '../../components/ParticipantScreen/Overlays/UserInfoOverlays/UserInfoOverlay/UserInfoOverlayProvider';
import useParticipants from '../useParticipants/useParticipants';
import useVideoContext from '../useVideoContext/useVideoContext';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';

export default function useUserInfoOverlayContext(): { participant?: LocalParticipant | RemoteParticipant } {
  const context = useContext(UserInfoOverlayContext);

  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const participant: LocalParticipant | RemoteParticipant | undefined =
    localParticipant.identity === context?.participantId
      ? localParticipant
      : participants.find(p => p.identity === context?.participantId);

  return { participant };
}
