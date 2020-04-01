import { PartyUser } from '../db';
import { Resolver, Query, Mutation, Authorized, Arg, Ctx } from 'type-graphql';
import { RequestContext } from '../context';
import { ENV } from '../config';

@Resolver(PartyUser)
export default class PartyUserResolver {
  @Query(_returns => [PartyUser])
  async users(@Ctx() { db }: RequestContext): Promise<PartyUser[]> {
    return db.getUsers();
  }

  @Mutation(_returns => PartyUser)
  async register(
    @Ctx() { db }: RequestContext,
    @Arg("identity") identity: string,
    @Arg("displayName") displayName: string,
    @Arg("photoURL", { nullable: true }) photoURL?: string,
  ): Promise<PartyUser> {
    const token = ENV === 'production' ? undefined : 'h9d7d9g';
    return db.addUser({
      identity,
      displayName,
      photoURL,
      token,
    });
  }
}
