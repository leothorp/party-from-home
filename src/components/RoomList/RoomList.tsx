import React, { useState, useEffect } from 'react';
import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { rooms } from '../../rooms';
import SyncClient from 'twilio-sync';

interface Participants {
  [key: string]: string[];
}

export default function RoomList() {
  const { user, getToken } = useAppState();
  const { isConnecting, connect, room } = useVideoContext();
  const roomState = useRoomState();
  const [participants, setParticipants] = useState<Participants>({});

  const switchRoom = (name: string) => {
    return (e: any) => {
      e.preventDefault();
      if (roomState !== 'disconnected') room.disconnect();
      getToken('CARLOS', name).then(token => connect(token));
    };
  };

  useEffect(() => {
    fetch(`/api/sync_token?identity=CARLOS`).then(res => {
      res.text().then(token => {
        const syncClient = new SyncClient(token);

        syncClient.map(`users`).then((map: any) =>
          map.getItems().then((paginator: any) => {
            const participants: Participants = {};

            paginator.items.forEach((item: any) => {
              if (item.value.room !== undefined) {
                if (participants[item.value.room]) {
                  participants[item.value.room].push(item.value.identity);
                } else {
                  participants[item.value.room] = [item.value.identity];
                }
              }
            });

            setParticipants(participants);
          })
        );
      });
    });
  }, []);

  return (
    <ul>
      {rooms.map(room => {
        const users = participants[room.id]?.map((p: string) => <li key={p}>{p}</li>);

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
