import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class PartyRoom {
  @Field(_type => ID)
  id!: string;
  @Field()
  name!: string;
  @Field()
  description!: string;
  @Field(_type => String)
  widgetId?: string | undefined;
  widgetStateId?: string | undefined;
}

export interface Admin {
  token: string;
}

ObjectType();
export class PartyUser {
  @Field(_type => ID)
  identity!: string;
  @Field()
  room!: string;
}

export interface SyncPermissions {
  read: boolean;
  write: boolean;
  manage: boolean;
}

export interface PartyDB {
  getUsers: () => Promise<PartyUser[]>;
  getUser: (identity: string) => Promise<PartyUser>;
  addUser: (user: PartyUser) => Promise<PartyUser>;
  editUser: (identity: string, user: PartyUser) => Promise<PartyUser>;
  removeUser: (identity: string) => Promise<void>;
  addRoom: (name: string) => Promise<PartyRoom>;
  editRoom: (id: string, room: PartyRoom) => Promise<PartyRoom>;
  removeRoom: (id: string) => Promise<void>;
  addRoomWidget: (roomId: string, widgetId: string) => Promise<void>;
  removeRoomWidget: (roomId: string) => Promise<void>;
}
