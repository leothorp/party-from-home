import { PartyUser } from '../db';
import { Resolver, Query, Mutation, Authorized, Arg, Ctx } from 'type-graphql';
import { RequestContext } from '../context';

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
    return db.addUser({
      identity,
      displayName,
      photoURL,
    });
  }
}
