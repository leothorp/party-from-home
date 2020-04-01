import { useCallback } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import useMountEffect from '../useMountEffect/useMountEffect';

const QUERY = gql`
    query Room($id: String!) {
        room(id: $id) {
            id
            name
            description
            adminScreenshare
            disableWidgets
            adminStartGames
        }
    }
`;

const UPDATE = gql`
    mutation UpdateRoom($id: String!, $input: RoomUpdateInput!) {
        updateRoom(id: $id, input: $input) {
            id
            name
            description
            adminScreenshare
            disableWidgets
            adminStartGames
        }
    }
`;

export default function useRoom(options?: { roomId?: string, onReceive?: (data: any) => void }) {
    const [get, { data }] = useLazyQuery(QUERY, {
        onCompleted: d => {
            if (options?.onReceive)
                options.onReceive(d.room);
        }
    });
    const [update] = useMutation(UPDATE);

    const getRoom = useCallback((id: string) => {
        if (data?.room.id === id && options?.onReceive)
            options.onReceive(data.room);
        else
            get({
                variables: {
                    id,
                }
            });
    }, [data, get, options]);

    const updateRoom = useCallback((room: any) => {
        update({
            variables: {
                id: data.room.id,
                input: room,
            }
        })
    }, [data, update]);

    useMountEffect(() => {
        if (options?.roomId) {
            getRoom(options.roomId);
        }
    });

    return { room: data?.room, getRoom, updateRoom };
}