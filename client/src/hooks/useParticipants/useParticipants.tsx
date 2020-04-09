import { useEffect, useState, useCallback } from 'react';
import { RemoteParticipant } from 'twilio-video';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useVideoContext from '../useVideoContext/useVideoContext';
import useMocks from '../../dev/useMocks';

var useParticipants = () => {
  const { room } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const [participants, setParticipants] = useState(Array.from(room?.participants?.values() || []));

  // When the dominant speaker changes, they are moved to the front of the participants array.
  // This means that the most recent dominant speakers will always be near the top of the
  // ParticipantStrip component.
  useEffect(() => {
    if (dominantSpeaker) {
      setParticipants(prevParticipants => [
        dominantSpeaker,
        ...prevParticipants.filter(participant => participant !== dominantSpeaker),
      ]);
    }
  }, [dominantSpeaker]);

  const participantConnected = useCallback(
    (participant: RemoteParticipant) => setParticipants(prevParticipants => [...prevParticipants, participant]),
    [setParticipants]
  );
  const participantDisconnected = useCallback(
    (participant: RemoteParticipant) =>
      setParticipants(prevParticipants => prevParticipants.filter(p => p.identity !== participant.identity)),
    []
  );

  useEffect(() => {
    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    return () => {
      room.off('participantConnected', participantConnected);
      room.off('participantDisconnected', participantDisconnected);
    };
  }, [room, participantConnected, participantDisconnected]);

  return participants;
};

if (process.env.REACT_APP_USE_MOCKS) {
  useParticipants = () => {
    const { participants } = useMocks();

    return participants;
  };
}

export default useParticipants;
