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
  async rooms(@Ctx() { db }: RequestContext): Promise<PartyRoom[]> {
    return db.getRooms();
  }

  @Query(_returns => PartyRoom)
  async room(@Arg('id') id: string, @Ctx() { db }: RequestContext): Promise<PartyRoom> {
    return db.getRoom(id);
  }

  @Mutation(_returns => PartyRoom)
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
  async deleteRoom(
    @Arg('id') id: string,
    @Ctx() { db }: RequestContext,
    @PubSub() pubsub: PubSubEngine
  ): Promise<boolean> {
    await db.removeRoom(id);
    await pubsub.publish('DELETED_ROOM', { id });
    return true;
  }

  @Subscription({ topics: 'NEW_ROOM' })
  newRoom(@Root() payload: RoomNotification): RoomNotification {
    return payload;
  }

  @Subscription({ topics: 'UPDATE_ROOM' })
  updatedRoom(@Root() payload: RoomNotification): RoomNotification {
    return payload;
  }

  @Subscription({ topics: 'DELETED_ROOM' })
  deletedRoom(@Root() payload: RoomNotification): RoomDeleteNotification {
    return payload;
  }
}
