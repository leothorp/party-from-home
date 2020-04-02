import inflection from 'inflection';
import { PartyDB, PartyRoom, PartyUser } from './';

export default class LocalPartyDB implements PartyDB {
  users: Map<string, PartyUser>;
  rooms: Map<string, PartyRoom>;

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
  }

  getUsers = async (): Promise<PartyUser[]> => {
    return Array.from(this.users.values());
  };

  getUser = async (identity: string): Promise<PartyUser> => {
    const user = this.users.get(identity);

    if (user) return user;
    else throw new Error(`user ${identity} not found`);
  };

  addUser = async (user: PartyUser): Promise<PartyUser> => {
    this.users.set(user.identity, user);
    return user;
  };

  editUser = async (identity: string, user: PartyUser): Promise<PartyUser> => {
    this.users.set(identity, user);
    return user;
  };

  removeUser = async (identity: string): Promise<void> => {
    this.users.delete(identity);
  };

  getRooms = async (): Promise<PartyRoom[]> => {
    return Array.from(this.rooms.values());
  };

  getRoom = async (id: string): Promise<PartyRoom> => {
    const room = this.rooms.get(id);

    if (room) return room;
    else throw new Error(`room ${id} not found`);
  };

  addRoom = async (name: string): Promise<PartyRoom> => {
    const id = inflection.underscore(name.replace(' ', ''));
    const room = {
      id,
      name,
      description: '',
    };

    this.rooms.set(id, room);

    return room;
  };

  editRoom = async (id: string, room: PartyRoom): Promise<PartyRoom> => {
    this.rooms.set(id, room);
    return room;
  };

  removeRoom = async (id: string): Promise<void> => {
    this.rooms.delete(id);
  };

  addRoomWidget = async (roomId: string, widgetId: string, widgetUser: string): Promise<PartyRoom> => {
    const room = this.rooms.get(roomId);

    if (!room) throw new Error(`room ${roomId} not found`);

    room.widgetId = widgetId;
    room.widgetUser = widgetUser;
    this.rooms.set(roomId, room);

    return room;
  };

  removeRoomWidget = async (roomId: string): Promise<PartyRoom> => {
    const room = this.rooms.get(roomId);

    if (!room) throw new Error(`room ${roomId} not found`);

    room.widgetId = undefined;
    this.rooms.set(roomId, room);

    return room;
  };

  setRoomWidgetState = async (roomId: string, state: string): Promise<PartyRoom> => {
    const room = this.rooms.get(roomId);

    if (!room) throw new Error(`room ${roomId} not found`);

    room.widgetState = state;

    this.rooms.set(roomId, room);

    return room;
  };
}
