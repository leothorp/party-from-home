import { PartyRoom } from '../db';
import { Resolver, Query, Mutation, Authorized, Arg, Ctx, Field, InputType } from 'type-graphql';
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

@Resolver(PartyRoom)
export default class PartyRoomResolver {
    @Query(_returns => [PartyRoom])
    async rooms(@Ctx() { db }: RequestContext): Promise<PartyRoom[]> {
        return db.getRooms();
    }

    @Query(_returns => PartyRoom)
    async room(@Arg("id") id: string, @Ctx() { db }: RequestContext): Promise<PartyRoom> {
        return db.getRoom(id);
    }

    @Mutation(_returns => PartyRoom)
    async createRoom(@Arg("name") name: string, @Ctx() { db }: RequestContext): Promise<PartyRoom> {
        return db.addRoom(name);
    }

    @Mutation(_returns => PartyRoom)
    async updateRoom(@Arg("id") id: string, @Arg("input") input: RoomUpdateInput, @Ctx() { db }: RequestContext): Promise<PartyRoom> {
        const room = await db.getRoom(id);
        return db.editRoom(id, {
            ...room,
            ...input,
        });
    }

    @Mutation(_returns => Boolean)
    async deleteRoom(@Arg("id") id: string, @Ctx() { db }: RequestContext): Promise<boolean> {
        await db.removeRoom(id);
        return true;
    }
}