import { useContext, useState, useEffect } from 'react';
import { VideoContext } from '../../components/VideoProvider';
import useMocks from '../../dev/useMocks';
import useParticipants from '../useParticipants/useParticipants';
import EventEmitter from 'events';

var useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};

if (process.env.REACT_APP_USE_MOCKS) {
  const fakeEmitter = new EventEmitter();

  useVideoContext = () => {
    const context = useContext(VideoContext);
    if (!context) {
      throw new Error('useVideoContext must be used within a VideoProvider');
    }
    const participants = useParticipants();
    const { connect, room, disconnect } = useMocks();
    const [contextRoom, setContextRoom] = useState<any>({
      ...context.room,
      state: 'disconnected',
      on: fakeEmitter.on,
      off: fakeEmitter.off,
      localParticipant: {
        tracks: new Map(),
        on: fakeEmitter.on,
        off: fakeEmitter.off,
      },
    });

    useEffect(() => {
      const newRoom = {
        ...context.room,
        ...contextRoom,
      };

      if (room && (!contextRoom?.state || contextRoom?.state === 'disconnected')) {
        newRoom.state = 'connected';
        newRoom.name = room.id;
        newRoom.participants = participants;
        newRoom.disconnect = disconnect;
        newRoom.localParticipant = {
          ...contextRoom.localParticipant,
          sid: 'SR232321111',
          identity: 'local',
          tracks: context.localTracks,
        };
        console.log(newRoom);
        setContextRoom(newRoom);
      } else if (!room && contextRoom?.state === 'connected') {
        newRoom.state = 'disconnected';
        setContextRoom(newRoom);
      }
    }, [context.localTracks, context.room, contextRoom, disconnect, participants, room]);

    return {
      ...context,
      room: contextRoom,
      isConnecting: false,
      connect,
    };
  };
}

export default useVideoContext;
