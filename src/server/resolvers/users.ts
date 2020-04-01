import { PartyUser } from '../db';
import {
  Resolver,
  Query,
  Mutation,
  Subscription,
  Authorized,
  Arg,
  Ctx,
  Root,
  PubSub,
  PubSubEngine,
  ObjectType,
  Field,
} from 'type-graphql';
import { RequestContext } from '../context';
import { ENV } from '../config';

@ObjectType()
class UserNotification {
  @Field()
  identity!: string;
  @Field()
  user!: PartyUser;
}

@ObjectType()
class UserDeleteNotification {
  @Field()
  identity!: string;
}

@Resolver(PartyUser)
export default class PartyUserResolver {
  @Query(_returns => [PartyUser])
  async users(@Ctx() { db }: RequestContext): Promise<PartyUser[]> {
    return db.getUsers();
  }

  @Query(_returns => PartyUser)
  async user(@Arg('identity') identity: string, @Ctx() { db }: RequestContext) {
    return db.getUser(identity);
  }

  @Mutation(_returns => PartyUser)
  async register(
    @Ctx() { db }: RequestContext,
    @PubSub() pubsub: PubSubEngine,
    @Arg('identity') identity: string,
    @Arg('displayName') displayName: string,
    @Arg('photoURL', { nullable: true }) photoURL?: string
  ): Promise<PartyUser> {
    const token = ENV === 'production' ? undefined : 'h9d7d9g';
    const user = await db.addUser({
      identity,
      displayName,
      photoURL,
      token,
    });

    await pubsub.publish('CREATE_USER', { identity: user.identity, user });

    return user;
  }

  @Subscription({ topics: 'CREATE_USER' })
  newUser(@Root() payload: UserNotification): UserNotification {
    return payload;
  }

  @Subscription({ topics: 'UPDATE_USER' })
  updatedUser(@Root() payload: UserNotification): UserNotification {
    return payload;
  }

  @Subscription({ topics: 'DELETED_USER' })
  deletedUser(@Root() payload: UserDeleteNotification): UserDeleteNotification {
    return payload;
  }
}
