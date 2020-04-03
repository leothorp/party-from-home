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
  Authorized,
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
    @Authorized('ADMIN')
    async broadcast(@Arg('message') message: string, @Ctx() { user, db }: RequestContext, @PubSub() pubsub: PubSubEngine): Promise<PartyBroadcast> {
        const broadcast = db.addBroadcast(user!.identity, message);

        await pubsub.publish('BROADCAST', broadcast);

        return broadcast;
    }

    @Subscription(_returns => BroadcastNotification, { topics: 'BROADCAST' })
    @Authorized('USER')
    async broadcastSent(@Root() payload: PartyBroadcast, @Ctx() { user, db }: RequestContext): Promise<BroadcastNotification> {
        return {
            id: payload.id,
            user: user!,
            message: payload.message,
        };
    }
}