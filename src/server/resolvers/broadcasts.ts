import { PartyBroadcast, PartyUser } from '../db';
import {
  Resolver,
  Query,
  Mutation,
  Subscription,
  Arg,
  Ctx,
  Root,
  PubSub,
  PubSubEngine,
  ObjectType,
  Field,
  FieldResolver,
  ID,
} from 'type-graphql';
import { RequestContext } from '../context';

@ObjectType()
class BroadcastNotification {
    @Field(_type => ID)
    id!: string;
    @Field()
    user!: PartyUser;
    @Field()
    message!: string;
}

@Resolver(_of => PartyBroadcast)
export class PartyBroadcastFieldResolver {
  @FieldResolver(_returns => PartyUser)
  async user(@Root() broadcast: PartyBroadcast, @Ctx() { db }: RequestContext): Promise<PartyUser> {
    return db.getUser(broadcast.identity);
  }
}

@Resolver(PartyBroadcast)
export default class PartyBroadcastResolver {
    @Query(_returns => [PartyBroadcast])
    async broadcasts(@Ctx() { db }: RequestContext): Promise<PartyBroadcast[]> {
        return db.getBroadcasts();
    }

    @Mutation(_returns => PartyBroadcast)
    async broadcast(@Arg('message') message: string, @Ctx() { identity, db }: RequestContext, @PubSub() pubsub: PubSubEngine): Promise<PartyBroadcast> {
        const broadcast = db.addBroadcast(identity!, message);

        await pubsub.publish('BROADCAST', broadcast);

        return broadcast;
    }

    @Subscription(_returns => BroadcastNotification, { topics: 'BROADCAST' })
    async broadcastSent(@Root() payload: PartyBroadcast, @Ctx() { db }: RequestContext): Promise<BroadcastNotification> {
        const user = await db.getUser(payload.identity);

        return {
            id: payload.id,
            user,
            message: payload.message,
        };
    }
}