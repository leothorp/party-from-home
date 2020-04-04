import { PartyRoom } from '../db';
import {
  Resolver,
  Query,
  Mutation,
  Subscription,
  Arg,
  Ctx,
  Field,
  InputType,
  ObjectType,
  Root,
  PubSub,
  PubSubEngine,
  Authorized,
} from 'type-graphql';
import { RequestContext } from '../context';

@InputType()
class RoomUpdateInput implements Partial<PartyRoom> {
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  adminScreenshare?: boolean;
  @Field({ nullable: true })
  disableWidgets?: boolean;
  @Field({ nullable: true })
  adminStartGames?: boolean;
}

@ObjectType()
class RoomNotification {
  @Field()
  id!: string;
  @Field()
  room!: PartyRoom;
}

@ObjectType()
class RoomDeleteNotification {
  @Field()
  id!: string;
}

@Resolver(PartyRoom)
export default class PartyRoomResolver {
  @Query(_returns => [PartyRoom])
  @Authorized('USER')
  async rooms(@Ctx() { db }: RequestContext): Promise<PartyRoom[]> {
    return db.getRooms();
  }

  @Query(_returns => PartyRoom)
  @Authorized('USER')
  async room(@Arg('id') id: string, @Ctx() { db }: RequestContext): Promise<PartyRoom> {
    return db.getRoom(id);
  }

  @Mutation(_returns => PartyRoom)
  @Authorized('ADMIN')
  async createRoom(
    @Arg('name') name: string,
    @Ctx() { db }: RequestContext,
    @PubSub() pubsub: PubSubEngine
  ): Promise<PartyRoom> {
    const room = await db.addRoom(name);
    const payload: RoomNotification = { id: room.id, room };
    await pubsub.publish('NEW_ROOM', payload);
    return room;
  }

  @Mutation(_returns => PartyRoom)
  @Authorized('ADMIN')
  async updateRoom(
    @Arg('id') id: string,
    @Arg('input') input: RoomUpdateInput,
    @Ctx() { db }: RequestContext,
    @PubSub() pubsub: PubSubEngine
  ): Promise<PartyRoom> {
    const room = await db.getRoom(id);
    const newRoom = await db.editRoom(id, {
      ...room,
      ...input,
    });

    await pubsub.publish('UPDATE_ROOM', { id: newRoom.id, room: newRoom });

    return newRoom;
  }

  @Mutation(_returns => Boolean)
  @Authorized('ADMIN')
  async deleteRoom(
    @Arg('id') id: string,
    @Ctx() { db }: RequestContext,
    @PubSub() pubsub: PubSubEngine
  ): Promise<boolean> {
    await db.removeRoom(id);
    await pubsub.publish('DELETED_ROOM', { id });
    return true;
  }

  @Mutation(_returns => PartyRoom)
  @Authorized('USER')
  async setRoomWidget(
    @Arg('id') id: string,
    @Arg('widgetId') widgetId: string,
    @Ctx() { user, db }: RequestContext,
    @PubSub() pubsub: PubSubEngine
  ): Promise<PartyRoom> {
    const newRoom = await db.addRoomWidget(id, widgetId, user!.identity);

    await pubsub.publish('UPDATE_ROOM', { id: newRoom.id, room: newRoom });

    return newRoom;
  }

  @Mutation(_returns => PartyRoom)
  @Authorized('ADMIN')
  async removeRoomWidget(
    @Arg('id') id: string,
    @Ctx() { db }: RequestContext,
    @PubSub() pubsub: PubSubEngine
  ): Promise<PartyRoom> {
    const newRoom = await db.removeRoomWidget(id);

    await pubsub.publish('UPDATE_ROOM', { id: newRoom.id, room: newRoom });

    return newRoom;
  }

  @Mutation(_returns => PartyRoom)
  @Authorized('USER')
  async setRoomWidgetState(
    @Arg('id') id: string,
    @Arg('state') state: string,
    @Ctx() { db }: RequestContext,
    @PubSub() pubsub: PubSubEngine
  ): Promise<PartyRoom> {
    const room = await db.getRoom(id);

    if (!room) throw new Error(`room ${id} not found`);

    const newRoom = await db.editRoom(room.id, { ...room, widgetState: state });

    await pubsub.publish('UPDATE_ROOM', { id: newRoom.id, room: newRoom });

    return newRoom;
  }

  @Subscription({ topics: 'NEW_ROOM' })
  @Authorized('USER')
  newRoom(@Root() payload: RoomNotification): RoomNotification {
    return payload;
  }

  @Subscription({ topics: 'UPDATE_ROOM' })
  @Authorized('USER')
  updatedRoom(@Root() payload: RoomNotification): RoomNotification {
    return payload;
  }

  @Subscription({ topics: 'DELETED_ROOM' })
  @Authorized('USER')
  deletedRoom(@Root() payload: RoomNotification): RoomDeleteNotification {
    return payload;
  }
}
