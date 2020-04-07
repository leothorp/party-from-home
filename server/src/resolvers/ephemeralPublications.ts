import { PartyUser } from '../db';
import {
  Resolver,
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
  InputType,
  Authorized,
} from 'type-graphql';
import { RequestContext } from '../context';

@ObjectType()
export class EphemeralMetadata {
  // Reaction metadata
  @Field()
  reactionType?: String;
  // Add other ephemeral metadata below
}

@InputType()
class EphemeralMetadataInput {
  // Reaction metadata
  @Field()
  reactionType!: string;
  // Add other ephemeral metadata below
}

@ObjectType()
export class EphemeralPublication {
  @Field()
  userId!: string;
  @Field()
  ephemeralType!: string;
  @Field()
  metadata?: EphemeralMetadata;
}

@ObjectType()
class EphemeralPublicationNotification {
  @Field()
  user!: PartyUser;
  @Field()
  ephemeralType!: string;
  @Field()
  metadata?: EphemeralMetadata;
}

@Resolver(_of => EphemeralPublication)
export class EphemeralPublicationFieldResolver {
  @FieldResolver(_returns => PartyUser)
  async user(@Root() publication: EphemeralPublication, @Ctx() { db }: RequestContext): Promise<PartyUser> {
    return db.getUser(publication.userId);
  }
}

@Resolver(EphemeralPublication)
export default class EphemeralPublicationResolver {
  // @Query(_returns => [PartyBroadcast])
  // @Authorized('USER')
  // async broadcasts(@Ctx() { db }: RequestContext): Promise<PartyBroadcast[]> {
  //     return db.getBroadcasts();
  // }

  @Mutation(_returns => EphemeralPublication)
  @Authorized('USER')
  async sendEphemeralPublication(
    @Arg('ephemeralType') ephemeralType: string,
    @Arg('metadata') metadata: EphemeralMetadataInput,
    @Ctx() { user, db }: RequestContext,
    @PubSub() pubsub: PubSubEngine
  ): Promise<EphemeralPublication> {
    console.log('goooot here with: ', ephemeralType, metadata, user);
    const ephemeralPublication = { userId: user!.identity, ephemeralType, metadata };
    console.log('goaaaats with ephemeralPublication : ', ephemeralPublication);

    await pubsub.publish('EPHEMERAL_PUBLICATION', ephemeralPublication);

    return ephemeralPublication;
  }

  @Subscription(_returns => EphemeralPublicationNotification, { topics: 'EPHEMERAL_PUBLICATION' })
  @Authorized('USER')
  async ephemeralPublicationSent(
    @Root() payload: EphemeralPublication,
    @Ctx() { user, db }: RequestContext
  ): Promise<EphemeralPublicationNotification> {
    return {
      user: user!,
      ephemeralType: payload.ephemeralType,
      ...payload,
    };
  }
}
