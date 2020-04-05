import { useState, useCallback, useEffect } from 'react';
import useMountEffect from '../hooks/useMountEffect/useMountEffect';
//@ts-ignore
import { createHook } from 'hookleton';
import EventEmitter from 'events';
import { RemoteParticipant, RemoteVideoTrack, RemoteTrackPublication } from 'twilio-video';

const USER_PICTURES = ['/images/man1.jpg', '/images/man2.jpg', '/images/woman1.jpg', '/images/woman2.jpg'];

class MockDocument extends EventEmitter {
  document: any;
}

class Mocks {
  maps: Map<string, MockDocument>;
  lists: Map<string, MockDocument>;
  documents: Map<string, MockDocument>;
  participantCount: number;
  room: { id: string } | undefined;
  dominantSpeaker: RemoteParticipant | undefined;

  constructor() {
    this.maps = new Map();
    this.lists = new Map();
    this.documents = new Map();
    this.participantCount = 1;
    this.dominantSpeaker = undefined;
  }
}

const mockUserNames = ['Jed', 'Josh', 'Toby', 'Claudia', 'Margaret', 'Donna', 'Sam', 'Will', 'Anabeth'];

const useMocks = () => {
  const [mocks, setMocks] = useState(new Mocks());
  const [canvasses, setCanvasses] = useState<HTMLElement[]>([]);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);

  // Create offscreen canvasses for fake participant video
  useMountEffect(() => {
    const userCanvasses = [];

    for (const src of USER_PICTURES) {
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 270;

      const image = new Image();
      image.src = src;

      image.onload = () => {
        const reDraw = () => {
          const ctx = canvas?.getContext('2d');
          //@ts-ignore
          ctx.drawImage(image, 0, 0, 480, 319);
        };

        setInterval(reDraw, 500);
      };

      userCanvasses.push(canvas);
    }

    setCanvasses(userCanvasses);
  });

  const connect = useCallback(
    (_token: string) => {
      const newMocks = { ...mocks };
      newMocks.room = { id: 'mock-room' };
      setMocks(newMocks);
    },
    [mocks, setMocks]
  );

  const disconnect = useCallback(() => {
    const newMocks = { ...mocks };
    newMocks.room = undefined;
    setMocks(newMocks);
  }, [mocks]);

  const setParticipantCount = useCallback((count: number) => {
    const newMocks = { ...mocks };
    newMocks.participantCount = count;
    setMocks(newMocks);
  }, [mocks]);

  const setDominantSpeaker = useCallback((participant: RemoteParticipant | undefined) => {
    setMocks({
      ...mocks,
      dominantSpeaker: participant,
    });
  }, [mocks]);

  useEffect(() => {
    if (mocks.room) {
      const newParticipants = [];

      for (var i = 0; i < mocks.participantCount; i++) {
        const canvas = canvasses[i % canvasses.length];
        const identity = mockUserNames[i % mockUserNames.length];
        //@ts-ignore
        const stream = canvas.captureStream(0);
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
          kind: 'video',
          trackName: 'camera',
          mediaStreamTrack: mediaTrack,
          track: mediaTrack,
          on: (_e, _l) => {},
          off: (_e, _l) => {},
        } as RemoteVideoTrack & RemoteTrackPublication;

        const videoTracks = new Map();
        videoTracks.set('camera', remoteTrack);

        newParticipants.push({
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

      setParticipants(newParticipants);
    }
  }, [canvasses, mocks.dominantSpeaker, mocks.participantCount, mocks.room]);

  useEffect(() => {
      if (participants.length < 1 && mocks.dominantSpeaker !== undefined)
        setDominantSpeaker(undefined);

      if (participants.length > 0 && !participants.find(p => p.identity === mocks.dominantSpeaker?.identity))
        setDominantSpeaker(participants[0]);
  }, [mocks.dominantSpeaker, participants, setDominantSpeaker]);

  return { participantCount: mocks.participantCount, setParticipantCount, participants, canvasses, connect, disconnect, room: mocks.room, dominantSpeaker: mocks.dominantSpeaker, setDominantSpeaker };
};

export default createHook(useMocks);
