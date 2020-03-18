import React, { useState } from 'react';
import useMountEffect from '../../hooks/useMountEffect/useMountEffect';
import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { rooms } from '../../rooms';
import SyncClient from 'twilio-sync';

interface Participants {
  [key: string]: string[];
}

export default function RoomList() {
  const { getToken } = useAppState();
  const { connect, room } = useVideoContext();
  const roomState = useRoomState();
  const [participants, setParticipants] = useState<Participants>({});

  const switchRoom = (name: string) => {
    return (e: any) => {
      e.preventDefault();
      if (roomState !== 'disconnected') room.disconnect();
      getToken('CARLOS', name).then(token => connect(token));
    };
  };

  useMountEffect(() => {
    fetch(`/api/sync_token?identity=CARLOS`).then(res => {
      res.text().then(token => {
        const syncClient = new SyncClient(token);

        syncClient.map(`users`).then((map: any) => {
          map.getItems().then((paginator: any) => {
            const roomParticipants: Participants = {};

            paginator.items.forEach((item: any) => {
              if (item.value.room !== undefined) {
                if (roomParticipants[item.value.room]) {
                  roomParticipants[item.value.room].push(item.value.identity);
                } else {
                  roomParticipants[item.value.room] = [item.value.identity];
                }
              }
            });

            setParticipants(roomParticipants);
          });

          map.on('itemAdded', (args: any) => {
            const value = args.item.value;
            const roomParticipants = { ...participants };

            if (value.room !== undefined) {
              if (roomParticipants[value.room]) {
                roomParticipants[value.room].push(value.identity);
              } else {
                roomParticipants[value.room] = [value.identity];
              }

              setParticipants(roomParticipants);
            }
          });

          map.on('itemRemoved', (args: any) => {
            const value = args.item.value;
            const roomParticipants = { ...participants };

            if (value.room !== undefined) {
              if (roomParticipants[value.room]) {
                const idx = roomParticipants[value.room].indexOf(value.identity);
                if (idx >= 0) {
                  roomParticipants[value.room].splice(idx, 1);
                  setParticipants(roomParticipants);
                }
              }
            }
          });

          map.on('itemUpdated', (args: any) => {
            const value = args.item.value;
            const roomParticipants = { ...participants };

            for (const roomName in roomParticipants) {
              const roomUsers = roomParticipants[roomName];
              const idx = roomUsers.indexOf(value.identity);
              if (idx >= 0) {
                roomUsers.splice(idx, 1);
              }
            }

            if (value.room !== undefined) {
              if (roomParticipants[value.room]) {
                roomParticipants[value.room].push(value.identity);
              } else {
                roomParticipants[value.room] = [value.identity];
              }
            }

            setParticipants(roomParticipants);
          });
        });
      });
    });
  });

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
