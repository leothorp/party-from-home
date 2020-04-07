import { v4 as uuid } from 'uuid';
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
import { ENV, ADMIN_PASSCODE } from '../config';

@ObjectType()
class UserNotification {
  @Field()
  identity!: string;
  @Field()
  user!: PartyUser;
}

@Resolver(PartyUser)
export default class PartyUserResolver {
  @Query(_returns => [PartyUser])
  @Authorized('USER')
  async users(@Ctx() { db }: RequestContext): Promise<PartyUser[]> {
    return db.getUsers();
  }

  @Query(_returns => PartyUser)
  @Authorized('USER')
  async user(@Arg('identity') identity: string, @Ctx() { db }: RequestContext) {
    return db.getUser(identity);
  }

  @Mutation(_returns => String, { nullable: true })
  async verifyPasscode(
    @Arg('passcode') userPasscode: string,
    @Ctx() { passcode }: RequestContext
  ): Promise<string | undefined> {
    if (userPasscode === passcode) return passcode;
    else return undefined;
  }

  @Mutation(_returns => PartyUser)
  async register(
    @Ctx() { db, passcode, user, session }: RequestContext,
    @PubSub() pubsub: PubSubEngine,
    @Arg('displayName') displayName: string,
    @Arg('photoURL', { nullable: true }) photoURL?: string,
    @Arg('passcode', { nullable: true }) userPasscode?: string
  ): Promise<PartyUser> {
    if (user) {
      return user;
    }

    if (userPasscode === passcode) {
      const newIdentity = uuid();
      const websocketToken = uuid();

      const newUser = await db.addUser({
        identity: newIdentity,
        displayName,
        photoURL,
        websocketToken,
        admin: ENV !== 'production',
        lastHeartbeat: new Date(),
      });

      if (session) session.identity = newUser.identity;

      await pubsub.publish('CREATE_USER', { identity: newUser.identity, user: newUser });

      return newUser;
    } else {
      throw new Error('invalid passcode');
    }
  }

  @Mutation(_returns => Boolean)
  @Authorized('USER')
  async heartbeat(@Ctx() { db, user }: RequestContext): Promise<boolean> {
    await db.editUser(user!.identity, {
      ...user!,
      lastHeartbeat: new Date(),
    });

    return true;
  }

  @Mutation(_returns => PartyUser)
  @Authorized('USER')
  async escalateUser(
    @Arg('adminPasscode') adminPasscode: string,
    @Ctx() { db, user }: RequestContext,
    @PubSub() pubsub: PubSubEngine
  ): Promise<PartyUser> {
    if (adminPasscode === ADMIN_PASSCODE) {
      const newUser = await db.editUser(user!.identity, {
        ...user!,
        admin: true,
      });

      await pubsub.publish('UPDATE_USER', { identity: newUser.identity, user: newUser });

      return newUser;
    } else {
      throw new Error('admin passcode invalid');
    }
  }

  @Subscription({ topics: 'CREATE_USER' })
  @Authorized('USER')
  newUser(@Root() payload: UserNotification): UserNotification {
    return payload;
  }

  @Subscription({ topics: 'UPDATE_USER' })
  @Authorized('USER')
  updatedUser(@Root() payload: UserNotification): UserNotification {
    return payload;
  }

  @Subscription({ topics: 'DELETED_USER' })
  @Authorized('USER')
  deletedUser(@Root() payload: UserNotification): UserNotification {
    return payload;
  }
}
