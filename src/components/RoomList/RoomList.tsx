import React, { useState, useEffect } from 'react';
import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const rooms = [
  { id: 'living', name: 'Living Room' },
  { id: 'jackbox', name: 'Jackbox' },
  { id: 'karaoke', name: 'Karaoke Room' },
  { id: 'dance', name: 'Dance Floor' },
];

export default function RoomList() {
  const { user, getToken } = useAppState();
  const { isConnecting, connect, room } = useVideoContext();
  const roomState = useRoomState();
  const [participants, setParticipants] = useState(new Map<string, any>());

  const switchRoom = (name: string) => {
    return (e: any) => {
      e.preventDefault();
      if (roomState !== 'disconnected') room.disconnect();
      getToken('CARLOS', name).then(token => connect(token));
    };
  };

  // todo(carlos): we don't actually want to update DOM every response, unless there is a change
  const getParticipants = (room: string) => {
    fetch(`/api/room/${room}/participants`).then(res => {
      res.json().then(p => {
        participants.set(
          room,
          p.map((p: any) => p.identity)
        );
        setParticipants(new Map<string, any>(participants));
      });
    });
  };

  useEffect(() => {
    rooms.forEach(room => {
      setInterval(() => getParticipants(room.id), 1000 + Math.random() * 500);
    });
  }, []);

  return (
    <ul>
      {rooms.map(room => {
        const users = participants.get(room.id)?.map((p: string) => <li key={p}>{p}</li>);

        return (
          <li key={room.id}>
            <a onClick={switchRoom(room.id)} href="">
              {room.name}
            </a>
            {users}
          </li>
        );
      })}
    </ul>
  );
}
