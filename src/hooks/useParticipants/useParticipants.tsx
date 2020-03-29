import { useEffect, useState } from 'react';
import { RemoteParticipant, RemoteVideoTrack, RemoteTrackPublication } from 'twilio-video';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useVideoContext from '../useVideoContext/useVideoContext';
import useMocks from '../../dev/useMocks';

var useParticipants = () => {
  const { room } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const [participants, setParticipants] = useState(Array.from(room.participants.values()));

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

  useEffect(() => {
    const participantConnected = (participant: RemoteParticipant) =>
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    const participantDisconnected = (participant: RemoteParticipant) =>
      setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    return () => {
      room.off('participantConnected', participantConnected);
      room.off('participantDisconnected', participantDisconnected);
    };
  }, [room]);

  return participants;
};

if (process.env.REACT_APP_USE_MOCKS) {
  const mockUserNames = ['Jed', 'Josh', 'Toby', 'Claudia', 'Margaret', 'Donna', 'Sam', 'Will', 'Anabeth'];

  useParticipants = () => {
    const { participantCount, canvasses } = useMocks();

    const participants: RemoteParticipant[] = [];

    for (var i = 0; i < participantCount; i++) {
      const canvas = canvasses[i % canvasses.length];
      const identity = mockUserNames[i % mockUserNames.length];
      //@ts-ignore
      const stream = canvas.captureStream(1);
      const mediaTrack: any = {
        on: (_e: any, _l: any) => {},
        off: (_e: any, _l: any) => {},
        attach: (el: any) => {
          //@ts-ignore
          el.srcObject = stream;
          el.autoplay = true;
          el.playsInline = true;
        },
        detach: (el: any) => {
          el.srcObject = undefined;
        },
        kind: 'video',
      };
      const remoteTrack: RemoteVideoTrack = {
        sid: 'SR2323323',
        isSwitchedOff: false,
        setPriority: _p => {},
        isStarted: true,
        isEnabled: true,
        name: 'camera',
        trackName: 'camera',
        mediaStreamTrack: mediaTrack,
        track: mediaTrack,
        on: (_e, _l) => {},
        off: (_e, _l) => {},
      } as RemoteVideoTrack & RemoteTrackPublication;

      const videoTracks = new Map();
      videoTracks.set('camera', remoteTrack);

      participants.push({
        identity: identity,
        sid: identity,
        tracks: videoTracks,
        audioTracks: new Map(),
        videoTracks: videoTracks,
        dataTracks: new Map(),
        networkQualityLevel: null,
        networkQualityStats: null,
        state: 'running',
        on: (_e, _l) => {},
        off: (_e, _l) => {},
      } as RemoteParticipant);
    }

    return participants;
  };
}

export default useParticipants;
