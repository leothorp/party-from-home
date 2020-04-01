import { useCallback } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

const QUERY = gql`
    {
        rooms {
            id
            name
            description
        }
    }
`;

const CREATE = gql`
    mutation CreateRoom($name: String!) {
        createRoom(name: $name) {
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

export default function useRooms() {
    const { data } = useQuery(QUERY);
    const [create] = useMutation(CREATE);
    const [update] = useMutation(UPDATE);

    const createRoom = useCallback((name: string) => {
        create({
            variables: { name, }
        })
    }, [create]);

    const updateRoom = useCallback((id: string, room: any) => {
        update({
            variables: {
                id,
                input: room,
            }
        });
    }, [update]);

    return { rooms: (data?.rooms || []) as any[], createRoom, updateRoom };
}