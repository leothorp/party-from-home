import { useCallback } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import useMountEffect from '../useMountEffect/useMountEffect';

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

const DELETE = gql`
  mutation DeleteRoom($id: String!) {
    deleteRoom(id: $id)
  }
`;

const NEW_ROOM = gql`
  subscription onNewRoom {
    newRoom {
      room {
        id
        name
        description
        adminScreenshare
        disableWidgets
        adminStartGames
      }
    }
  }
`;

const UPDATED_ROOM = gql`
  subscription onUpdatedRoom {
    updatedRoom {
      room {
        id
        name
        description
        adminScreenshare
        disableWidgets
        adminStartGames
      }
    }
  }
`;

const DELETED_ROOM = gql`
  subscription onDeletedRoom {
    deletedRoom {
      id
    }
  }
`;

export default function useRooms() {
  const { data, subscribeToMore } = useQuery(QUERY);
  const [create] = useMutation(CREATE);
  const [update] = useMutation(UPDATE);
  const [deleteMut] = useMutation(DELETE);

  useMountEffect(() => {
    subscribeToMore({
      document: NEW_ROOM,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;

        const newRoom = subscriptionData.data.newRoom.room;

        if (prev.rooms.find((r: any) => r.id === newRoom.id)) return prev;

        return {
          ...prev,
          rooms: [...prev.rooms, newRoom],
        };
      },
    });

    subscribeToMore({
      document: UPDATED_ROOM,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;

        const newRoom = subscriptionData.data.updatedRoom.room;
        const newRoot = { ...prev };
        const roomIndex = newRoot.rooms.findIndex((r: any) => r.id === newRoom.id);

        if (roomIndex >= 0) {
          newRoot.rooms[roomIndex] = newRoom;
          return newRoot;
        } else {
          return prev;
        }
      },
    });

    subscribeToMore({
      document: DELETED_ROOM,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;

        const roomId = subscriptionData.data.deletedRoom.id;

        return {
          ...prev,
          rooms: prev.rooms.filter((r: any) => r.id !== roomId),
        };
      },
    });
  });

  const createRoom = useCallback(
    (name: string) => {
      create({
        variables: { name },
      });
    },
    [create]
  );

  const updateRoom = useCallback(
    (id: string, room: any) => {
      update({
        variables: {
          id,
          input: room,
        },
      });
    },
    [update]
  );

  const deleteRoom = useCallback((id: string) => {
    deleteMut({
      variables: { id },
    });
  }, []);

  return { rooms: (data?.rooms || []) as any[], createRoom, updateRoom, deleteRoom };
}
