import React from 'react';
import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

export default function RoomList() {
    const { user, getToken } = useAppState();
    const { isConnecting, connect, room } = useVideoContext();
    const roomState = useRoomState();

    const switchRoom = (name: string) => {
        return (e: any) => {
            e.preventDefault();
            if (roomState !== 'disconnected')
                room.disconnect();
            getToken('CARLOS', name).then(token => connect(token));
        };
    };

    return (
        <ul>
            <li><a onClick={switchRoom('living')} href=''>Living Room</a></li>
            <li><a onClick={switchRoom('jackbox')} href=''>Jackbox Room</a></li>
            <li><a onClick={switchRoom('karaoke')} href=''>Karaoke Room</a></li>
            <li><a onClick={switchRoom('dance')} href=''>Dance Floor</a></li>
        </ul>
    );
};