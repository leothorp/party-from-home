import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class PartyRoom {
  @Field(_type => ID)
  id!: string;
  @Field()
  name!: string;
  @Field()
  description!: string;
  @Field(_type => String, { nullable: true })
  widgetId?: string | undefined;
  @Field(_type => String, { nullable: true })
  widgetState?: string | undefined;
  @Field(_type => String, { nullable: true })
  widgetUser?: string | undefined;
  @Field({ defaultValue: false })
  adminScreenshare?: boolean = false;
  @Field({ defaultValue: false })
  disableWidgets?: boolean = false;
  @Field({ defaultValue: false })
  adminStartGames?: boolean = false;
}

export interface Admin {
  token: string;
}

@ObjectType()
export class PartyUser {
  @Field(_type => ID)
  identity!: string;
  @Field()
  displayName!: string;
  @Field({ nullable: true })
  photoURL?: string;
  @Field({ nullable: true })
  room?: string;
  @Field({ nullable: true })
  websocketToken?: string;
  @Field({ defaultValue: false })
  admin?: boolean = false;
  lastHeartbeat!: Date;
}

@ObjectType()
export class PartyBroadcast {
  @Field(_type => ID)
  id!: string;
  @Field()
  identity!: string;
  @Field()
  message!: string;
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
  getRooms: () => Promise<PartyRoom[]>;
  getRoom: (id: string) => Promise<PartyRoom>;
  addRoom: (name: string) => Promise<PartyRoom>;
  editRoom: (id: string, room: PartyRoom) => Promise<PartyRoom>;
  removeRoom: (id: string) => Promise<void>;
  addRoomWidget: (roomId: string, widgetId: string, widgetUser: string) => Promise<PartyRoom>;
  removeRoomWidget: (roomId: string) => Promise<PartyRoom>;
  setRoomWidgetState: (roomId: string, state: string) => Promise<PartyRoom>;
  getBroadcasts: () => Promise<PartyBroadcast[]>;
  addBroadcast: (identity: string, message: string) => Promise<PartyBroadcast>;
}
